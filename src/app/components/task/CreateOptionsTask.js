import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import MdCancel from 'react-icons/lib/md/cancel';
import MdCheckBoxOutlineBlank from 'react-icons/lib/md/check-box-outline-blank';
import MdRadioButtonUnchecked from 'react-icons/lib/md/radio-button-unchecked';
import Attribution from './Attribution';
import ConfirmRequired from './ConfirmRequired';
import Message from '../Message';
import { getStatus } from '../../helpers';
import { mediaStatuses, mediaLastStatus } from '../../customHelpers';
import { units, StyledIconButton, StyledTaskDescription } from '../../styles/js/shared';

const messages = defineMessages({
  addValue: {
    id: 'singleChoiceTask.addValue',
    defaultMessage: 'Add Option',
  },
  value: {
    id: 'singleChoiceTask.value',
    defaultMessage: 'Value',
  },
  addOther: {
    id: 'singleChoiceTask.addOther',
    defaultMessage: 'Add "Other"',
  },
  other: {
    id: 'singleChoiceTask.other',
    defaultMessage: 'Other',
  },
  newTask: {
    id: 'singleChoiceTask.newTask',
    defaultMessage: 'New task',
  },
});

class CreateOptionsTask extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      label: null,
      description: null,
      message: null,
      options: [{ label: '' }, { label: '' }],
      submitDisabled: true,
      showAssignmentField: false,
      required: false,
      confirmRequired: false,
    };
  }

  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }

  handleAddValue() {
    const options = Array.isArray(this.state.options) ? this.state.options.slice(0) : [];
    if (this.state.hasOther) {
      options.splice(-1, 0, { label: '' });
    } else {
      options.push({ label: '' });
    }
    this.setState({ options });

    this.validateTask(this.state.label, options);
  }

  handleAddOther() {
    const options = Array.isArray(this.state.options) ? this.state.options.slice(0) : [];
    const other = true;
    let label = '';

    if (!this.state.hasOther) {
      label = this.props.intl.formatMessage(messages.other);
      options.push({ label, other });
      this.setState({ options, hasOther: true });
    }

    this.validateTask(this.state.label, options);
  }

  handleEditOption(e) {
    const options = this.state.options.slice(0);
    options[parseInt(e.target.id, 10)].label = e.target.value;
    this.setState({ options });

    this.validateTask(this.state.label, options);
  }

  handleRemoveOption(index) {
    const options = this.state.options.slice(0);
    let hasOther = null;

    if (this.state.hasOther) {
      hasOther = index !== options.length - 1;
    } else {
      hasOther = false;
    }

    options.splice(index, 1);

    this.setState({ options, hasOther });

    this.validateTask(this.state.label, options);
  }

  validateTask(label, options) {
    const valid = !!(label && label.trim()) && options.filter(item => item.label !== '').length > 1;
    this.setState({ submitDisabled: !valid });
    return valid;
  }

  handleLabelChange(e) {
    this.setState({ label: e.target.value });
    this.validateTask(e.target.value, this.state.options);
  }

  handleSelectRequired(e, inputChecked) {
    const { media } = this.props;
    const status = getStatus(mediaStatuses(media), mediaLastStatus(media));

    if (inputChecked && status.completed && !media.last_status_obj.locked) {
      this.setState({ required: inputChecked, confirmRequired: true, status });
    } else {
      this.setState({ required: inputChecked });
    }
  }

  handleSubmitTask() {
    const jsonoptions = JSON.stringify(this.state.options.filter(item => item.label !== ''));

    if (!this.state.submitDisabled) {
      this.props.onSubmit(
        this.state.label,
        this.state.description,
        this.state.required,
        jsonoptions,
      );
      this.setState({ submitDisabled: true });
    }
  }

  toggleAssignmentField() {
    this.setState({ showAssignmentField: !this.state.showAssignmentField });
  }

  render() {
    const canRemove = this.state.options.length > 2;

    const { formatMessage } = this.props.intl;

    const taskIcon = {
      single_choice: <MdRadioButtonUnchecked />,
      multiple_choice: <MdCheckBoxOutlineBlank />,
    };

    const actions = [
      <FlatButton
        key="create-task__dialog-cancel-button"
        label={<FormattedMessage id="tasks.cancelAdd" defaultMessage="Cancel" />}
        onClick={this.props.onDismiss}
      />,
      <FlatButton
        key="create-task__dialog-submit-button"
        className="create-task__dialog-submit-button"
        label={<FormattedMessage id="tasks.add" defaultMessage="Create Task" />}
        primary
        keyboardFocused
        onClick={this.handleSubmitTask.bind(this)}
        disabled={this.state.submitDisabled}
      />,
    ];

    return (
      <div>
        <Dialog
          title={this.props.intl.formatMessage(messages.newTask)}
          className="create-task__dialog"
          actions={actions}
          modal={false}
          open
          onRequestClose={this.props.onDismiss}
          autoScrollBodyContent
        >
          <Message message={this.state.message} />

          <TextField
            id="task-label-input"
            className="tasks__task-label-input"
            floatingLabelText={<FormattedMessage id="tasks.taskPrompt" defaultMessage="Prompt" />}
            onChange={this.handleLabelChange.bind(this)}
            multiLine
            fullWidth
          />

          <Checkbox
            label={
              <FormattedMessage
                id="tasks.requiredCheckbox"
                defaultMessage="Required"
              />
            }
            checked={this.state.required}
            onCheck={this.handleSelectRequired.bind(this)}
          />
          <ConfirmRequired
            open={this.state.confirmRequired}
            status={this.state.status}
            handleCancel={() => { this.setState({ required: false, confirmRequired: false }); }}
            handleConfirm={() => { this.setState({ confirmRequired: false }); }}
          />

          <div style={{ marginTop: units(2) }}>
            {this.state.options.map((item, index) => (
              <div key={`create-task__add-options-radiobutton-${index.toString()}`}>
                <StyledIconButton>
                  { taskIcon[this.props.taskType] }
                </StyledIconButton>
                <TextField
                  key="create-task__add-option-input"
                  className="create-task__add-option-input"
                  id={index.toString()}
                  onChange={this.handleEditOption.bind(this)}
                  placeholder={`${formatMessage(messages.value)} ${index + 1}`}
                  value={item.label}
                  disabled={item.other}
                  style={{ padding: `${units(0.5)} ${units(1)}`, width: '75%' }}
                />
                {canRemove ?
                  <StyledIconButton>
                    <MdCancel
                      key="create-task__remove-option-button"
                      className="create-task__remove-option-button create-task__md-icon"
                      onClick={this.handleRemoveOption.bind(this, index)}
                    />
                  </StyledIconButton>
                  : null}
              </div>
            ))}
            <div style={{ marginTop: units(1) }}>
              <FlatButton
                label={this.props.intl.formatMessage(messages.addValue)}
                onClick={this.handleAddValue.bind(this)}
              />
              <FlatButton
                label={this.props.intl.formatMessage(messages.addOther)}
                onClick={this.handleAddOther.bind(this)}
                disabled={this.state.hasOther}
              />
            </div>
          </div>
          <StyledTaskDescription>
            <input
              className="create-task__add-task-description"
              id="create-task__add-task-description"
              type="checkbox"
            />
            <TextField
              id="task-description-input"
              className="create-task__task-description-input"
              floatingLabelText={
                <FormattedMessage id="tasks.description" defaultMessage="Description" />
              }
              onChange={this.handleDescriptionChange.bind(this)}
              multiLine
            />
            <label
              className="create-task__add-task-description-label"
              htmlFor="create-task__add-task-description"
            >
              <span className="create-task__add-task-description-icon">+</span>{' '}
              <FormattedMessage id="tasks.addDescription" defaultMessage="Add a description" />
            </label>

            { this.state.showAssignmentField ?
              <Attribution multi={false} selectedUsers={[]} id="new" /> :
              <button
                className="create-task__add-assignment-button"
                onClick={this.toggleAssignmentField.bind(this)}
              >
                {'+ '}
                <FormattedMessage id="tasks.assign" defaultMessage="Assign" />
              </button>
            }
          </StyledTaskDescription>
        </Dialog>
      </div>
    );
  }
}

export default injectIntl(CreateOptionsTask);
