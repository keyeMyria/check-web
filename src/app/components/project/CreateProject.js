import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Relay from 'react-relay';
import { Card, CardActions, CardText, CardHeader } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import styled from 'styled-components';
import config from 'config'; // eslint-disable-line require-path-exists/exists
import UserUtil from '../user/UserUtil';
import TeamProjectsNudge from '../team/TeamProjectsNudge';
import CreateProjectMutation from '../../relay/mutations/CreateProjectMutation';
import CheckContext from '../../CheckContext';
import { safelyParseJSON } from '../../helpers';
import {
  title1,
  units,
} from '../../styles/js/shared';

const messages = defineMessages({
  addProject: {
    id: 'createProject.addProject',
    defaultMessage: 'Add project',
  },
  cardTitle: {
    id: 'createProject.title',
    defaultMessage: 'Add a project',
  },
  cardTitleBlank: {
    id: 'createProject.titleBlank',
    defaultMessage: 'Add your first project',
  },
  newProjectName: {
    id: 'createProject.newProjectName',
    defaultMessage: 'Project name',
  },
  error: {
    id: 'createProject.error',
    defaultMessage: 'Sorry, could not create the project',
  },
});

class CreateProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null,
      name: null,
      submitDisabled: false,
    };
  }

  componentDidMount() {
    if (this.props.autofocus && this.projectInput) {
      this.projectInput.focus();
    }
  }

  getCurrentUser() {
    return new CheckContext(this).getContextStore().currentUser;
  }

  handleChange = (e) => {
    this.setState({ name: e.target.value });
  };

  handleSubmit(e) {
    const title = this.projectInput.getValue();
    const { team } = this.props;
    const context = new CheckContext(this);
    const { history } = context.getContextStore();

    const onFailure = (transaction) => {
      const error = transaction.getError();
      let message = this.props.intl.formatMessage(messages.error);
      const json = safelyParseJSON(error.source);
      if (json && json.error) {
        message = json.error;
      }
      this.setState({ message, submitDisabled: false });
    };

    const onSuccess = (response) => {
      const { createProject: { project } } = response;
      const path = `/${team.slug}/project/${project.dbid}`;
      history.push(path);
    };

    if (!this.state.submitDisabled) {
      Relay.Store.commitUpdate(
        new CreateProjectMutation({
          title,
          team,
        }),
        { onSuccess, onFailure },
      );
      this.setState({ submitDisabled: true });
    }

    e.preventDefault();
  }

  render() {
    const textInput = (
      <TextField
        id="create-project-title"
        className={this.props.className || 'team__new-project-input'}
        floatingLabelText={this.props.intl.formatMessage(messages.newProjectName)}
        ref={(i) => { this.projectInput = i; }}
        style={this.props.style}
        autoFocus={this.props.autoFocus}
        errorText={this.state.message}
        onChange={this.handleChange}
        fullWidth
      />
    );

    const submitButton = (
      <FlatButton
        id="create-project-submit-button"
        label={this.props.intl.formatMessage(messages.addProject)}
        onClick={this.handleSubmit.bind(this)}
        primary
        disabled={!this.state.name}
      />
    );

    const form = (
      <form onSubmit={this.handleSubmit.bind(this)} className="create-project">
        {textInput}
        {submitButton}
      </form>
    );

    const StyledCardHeader = styled(CardHeader)`
      span {
        font: ${title1} !important;
      }
    `;

    const { team } = this.props;

    if (team.plan === 'pro' ||
      team.projects.edges.length < team.limits.max_number_of_projects) {
      if (this.props.renderCard) {
        const cardTitle = team.projects.edges.length
          ? messages.cardTitle
          : messages.cardTitleBlank;

        return (
          <Card
            style={{ marginBottom: units(2) }}
            initiallyExpanded
          >
            <StyledCardHeader
              title={this.props.intl.formatMessage(cardTitle)}
              showExpandableButton
            />
            <CardText expandable>
              <form onSubmit={this.handleSubmit.bind(this)} className="create-project">
                {textInput}
              </form>
            </CardText>
            <CardActions expandable>
              {submitButton}
            </CardActions>
          </Card>
        );
      }

      return form;
    }

    if (config.appName === 'check' &&
      UserUtil.myRole(this.getCurrentUser(), team.slug) === 'owner') {
      return <TeamProjectsNudge renderCard={this.props.renderCard} />;
    }

    return null;
  }
}

CreateProject.propTypes = {
  // https://github.com/yannickcr/eslint-plugin-react/issues/1389
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

CreateProject.contextTypes = {
  store: PropTypes.object,
};

export default injectIntl(CreateProject);
