import React, { Component } from 'react';
import Radio, { RadioGroup } from 'material-ui-next/Radio';
import { FormGroup, FormControlLabel } from 'material-ui-next/Form';
import FlatButton from 'material-ui/FlatButton';
import { FormattedMessage } from 'react-intl';
import CreateOptionsTask from './CreateOptionsTask';
import { safelyParseJSON } from '../../helpers';
import { StyledSmallTextField } from '../../styles/js/shared';

class SingleChoiceTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      responseOther: null,
      taskAnswerDisabled: true,
    };
  }

  handleSubmitResponse() {
    if (!this.state.taskAnswerDisabled) {
      const response = this.state.response ? this.state.response.trim() : this.props.response;

      this.props.onSubmit(response, this.state.note);
      this.setState({ taskAnswerDisabled: true });
    }
  }

  canSubmit() {
    const response = this.state.response ? this.state.response.trim() : this.props.response;
    const can_submit = !!response;

    this.setState({ taskAnswerDisabled: !can_submit });
    return can_submit;
  }

  handleChange(e) {
    this.setState({ note: e.target.value }, this.canSubmit);
  }

  handleCancelResponse() {
    this.setState({
      response: null,
      responseOther: null,
      otherSelected: false,
      note: '',
      focus: false,
    }, this.canSubmit);

    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  }

  handleSelectRadio(e) {
    this.setState({
      focus: true,
      response: e.target.value,
      responseOther: '',
      otherSelected: false,
      taskAnswerDisabled: false,
    });
  }

  handleSelectRadioOther() {
    // TODO Use React ref
    const input = document.querySelector('.task__option_other_text_input input');

    if (input) {
      input.focus();
    }

    this.setState({
      focus: true,
      response: '',
      responseOther: '',
      otherSelected: true,
      taskAnswerDisabled: true,
    });
  }

  handleEditOther(e) {
    const { value } = e.target;
    this.setState({
      focus: true,
      response: value,
      responseOther: value,
      otherSelected: true,
    }, this.canSubmit);
  }

  handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (this.canSubmit()) {
        this.setState({ taskAnswerDisabled: true });
        this.handleSubmitResponse();
      }
      e.preventDefault();
    }
  }

  renderOptions(response, note, jsonoptions) {
    const options = safelyParseJSON(jsonoptions);
    const editable = !response || this.props.mode === 'edit_response';
    const submitCallback = this.handleSubmitResponse.bind(this);
    const cancelCallback = this.handleCancelResponse.bind(this);
    const keyPressCallback = this.handleKeyPress.bind(this);

    const actionBtns = (
      <div>
        <FlatButton
          label={<FormattedMessage id="tasks.cancelEdit" defaultMessage="Cancel" />}
          onClick={cancelCallback}
        />
        <FlatButton
          className="task__submit"
          label={<FormattedMessage id="tasks.submit" defaultMessage="Resolve Task" />}
          primary
          onClick={submitCallback}
          disabled={this.state.taskAnswerDisabled}
        />
      </div>
    );

    if (Array.isArray(options) && options.length > 0) {
      const otherIndex = options.findIndex(item => item.other);
      const other = otherIndex >= 0 ? options.splice(otherIndex, 1).pop() : null;
      const responseIndex =
        options.findIndex(item => item.label === response || item.label === this.state.response);
      let responseOther = '';
      if (typeof this.state.responseOther !== 'undefined' && this.state.responseOther !== null) {
        ({ responseOther } = this.state.responseOther);
      } else if (responseIndex < 0) {
        responseOther = response;
      }
      const responseOtherSelected = this.state.otherSelected || responseOther
        ? responseOther
        : 'none';
      const responseSelected = this.state.response == null ? response : this.state.response;

      const responseNote = typeof this.state.note !== 'undefined' && this.state.note !== null
        ? this.state.note
        : note || '';

      return (
        <div className="task__options">
          <FormGroup>
            <RadioGroup
              name="response"
              onChange={this.handleSelectRadio.bind(this)}
              value={responseSelected}
            >
              {options.map((item, index) => (
                <FormControlLabel
                  key={`task__options--radiobutton-${index.toString()}`}
                  id={index.toString()}
                  value={item.label}
                  label={item.label}
                  control={
                    <Radio disabled={!editable} />
                  }
                />
              ))}
            </RadioGroup>

            <div
              style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
              className="task__options_other"
            >
              {other ?
                <RadioGroup
                  name="task__option_other_radio"
                  key="task__option_other_radio"
                  className="task__option_other_radio"
                  value={responseOtherSelected}
                  onChange={this.handleSelectRadioOther.bind(this)}
                >
                  <FormControlLabel
                    value={responseOther}
                    control={
                      <Radio disabled={!editable} />
                    }
                    label={
                      <StyledSmallTextField
                        key="task__option_other_text_input"
                        className="task__option_other_text_input"
                        placeholder={other.label}
                        value={responseOther}
                        name="response"
                        onKeyPress={keyPressCallback}
                        onChange={this.handleEditOther.bind(this)}
                        disabled={!editable}
                        multiLine
                      />
                    }
                  />
                </RadioGroup>
                : null}
            </div>

            {editable ?
              <StyledSmallTextField
                className="task__response-note-input"
                hintText={
                  <FormattedMessage
                    id="task.noteLabel"
                    defaultMessage="Note any additional details here."
                  />
                }
                name="note"
                value={responseNote}
                onKeyPress={keyPressCallback}
                onChange={this.handleChange.bind(this)}
                fullWidth
                multiLine
              /> : null}
            {(this.state.focus && editable) || this.props.mode === 'edit_response'
              ? actionBtns
              : null}
          </FormGroup>
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      media,
      response,
      note,
      jsonoptions,
    } = this.props;

    return (
      <div>
        {this.props.mode === 'create' ?
          <CreateOptionsTask
            taskType="single_choice"
            media={media}
            onDismiss={this.props.onDismiss.bind(this)}
            onSubmit={this.props.onSubmit.bind(this)}
          />
          : null
        }
        {this.props.mode === 'respond' ? this.renderOptions(response, note, jsonoptions) : null}
        {this.props.mode === 'show_response' && response
          ? this.renderOptions(response, note, jsonoptions)
          : null}
        {this.props.mode === 'edit_response'
          ? this.renderOptions(response, note, jsonoptions)
          : null}
      </div>
    );
  }
}

export default SingleChoiceTask;
