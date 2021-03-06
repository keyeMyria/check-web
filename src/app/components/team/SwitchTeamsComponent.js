import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import { FormattedMessage, defineMessages, intlShape, injectIntl } from 'react-intl';
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { Link } from 'react-router';
import { Card, CardActions, CardText, CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import styled from 'styled-components';
import {
  alertRed,
  highlightBlue,
  checkBlue,
  defaultBorderRadius,
  defaultBorderWidth,
  opaqueBlack87,
  borderWidthMedium,
  tiny,
  units,
  titleStyle,
  listStyle,
  listItemButtonStyle,
  white,
  black05,
} from '../../styles/js/shared';
import UpdateUserMutation from '../../relay/mutations/UpdateUserMutation';
import DeleteTeamUserMutation from '../../relay/mutations/DeleteTeamUserMutation';
import CheckContext from '../../CheckContext';
import { can } from '../Can';
import { safelyParseJSON } from '../../helpers';

const messages = defineMessages({
  switchTeamsError: {
    id: 'switchTeams.error',
    defaultMessage: 'Sorry, could not switch teams',
  },
  switchTeamsMember: {
    id: 'switchTeams.member',
    defaultMessage: '{membersCount, plural, =0 {No members} one {1 member} other {# members}}',
  },
  joinTeam: {
    id: 'switchTeams.joinRequestMessage',
    defaultMessage: 'You requested to join',
  },
});

class SwitchTeamsComponent extends Component {
  getContext() {
    return new CheckContext(this);
  }

  setCurrentTeam(team, user) {
    const context = this.getContext();
    const { history, currentUser } = context.getContextStore();

    currentUser.current_team = team;
    context.setContextStore({ team, currentUser });

    const onFailure = (transaction) => {
      const error = transaction.getError();
      let message = this.props.intl.formatMessage(messages.switchTeamsError);
      const json = safelyParseJSON(error.source);
      if (json && json.error) {
        message = json.error;
      }
      console.error(message); // eslint-disable-line no-console
    };

    const onSuccess = () => {
      const path = `/${team.slug}`;
      history.push(path);
    };

    Relay.Store.commitUpdate(
      new UpdateUserMutation({
        current_team_id: team.dbid,
        current_user_id: user.id,
      }),
      { onSuccess, onFailure },
    );
  }

  cancelRequest(team, e) {
    Relay.Store.commitUpdate(new DeleteTeamUserMutation({
      id: team.teamUser_id,
      user: this.props.user,
    }));
    e.preventDefault();
  }

  render() {
    const { user, user: { team_users: { edges: teamUsers } } } = this.props;
    const { currentUser } = this.getContext().getContextStore();
    const isUserSelf = (user.id === currentUser.id);
    const otherTeams = [];
    const pendingTeams = [];

    const ListItemContainer = styled.div`
      position: relative;
      .team__badge {
        background-color: ${opaqueBlack87};
        border-radius: ${borderWidthMedium};
        color: ${white};
        font: ${tiny};
        line-height: 1.2;
        padding: ${units(0.25)} ${units(0.5)};
        position: absolute;
        ${props => props.isRtl ? 'right' : 'left'}: ${units(5)};
        top: ${units(2.5)};
        text-transform: uppercase;
        z-index: 9999;
      }
    `;

    const teamAvatarStyle = {
      border: `${defaultBorderWidth} solid ${black05}`,
      borderRadius: `${defaultBorderRadius}`,
      backgroundColor: white,
    };

    const teamButton = (team) => {
      if (team.status === 'requested') {
        return (
          <FlatButton
            style={listItemButtonStyle}
            hoverColor={alertRed}
            onClick={this.cancelRequest.bind(this, team)}
          >
            <FormattedMessage id="switchTeams.cancelJoinRequest" defaultMessage="Cancel" />
          </FlatButton>
        );
      } else if (team.status === 'banned') {
        return (
          <FlatButton style={listItemButtonStyle} disabled>
            <FormattedMessage id="switchTeams.bannedJoinRequest" defaultMessage="Cancelled" />
          </FlatButton>
        );
      }
      return '';
    };

    teamUsers.forEach((teamUser) => {
      const { team, status } = teamUser.node;
      const visible = can(team.permissions, 'read Team');

      if (!isUserSelf && !visible) { return; }

      if (status === 'requested' || status === 'banned') {
        team.status = status;
        team.teamUser_id = teamUser.node.id;
        pendingTeams.push(team);
      } else {
        otherTeams.push(team);
      }
    });

    const cardTitle = isUserSelf ?
      <FormattedMessage id="teams.yourTeams" defaultMessage="Your teams" /> :
      <FormattedMessage id="teams.userTeams" defaultMessage="{name}'s teams" values={{ name: user.name }} />;

    return (
      <Card>
        <CardHeader
          titleStyle={titleStyle}
          title={cardTitle}
        />
        { (otherTeams.length + pendingTeams.length) ?
          <List className="teams" style={listStyle}>
            {otherTeams.map(team => (
              <ListItemContainer key={team.dbid} isRtl={this.props.isRtl}>
                {team.plan === 'pro' ? <span className="team__badge">PRO</span> : null}
                <ListItem
                  hoverColor={highlightBlue}
                  focusRippleColor={checkBlue}
                  touchRippleColor={checkBlue}
                  containerElement={<Link to={`/${team.slug}`} />}
                  leftAvatar={<Avatar style={teamAvatarStyle} src={team.avatar} />}
                  onClick={this.setCurrentTeam.bind(this, team, currentUser)}
                  primaryText={team.name}
                  rightIcon={<KeyboardArrowRight />}
                  secondaryText={this.props.intl.formatMessage(messages.switchTeamsMember, {
                    membersCount: team.members_count,
                  })}
                />
              </ListItemContainer>
            ))}

            {pendingTeams.map(team => (
              <ListItem
                key={team.dbid}
                hoverColor={highlightBlue}
                focusRippleColor={checkBlue}
                touchRippleColor={checkBlue}
                containerElement={<Link to={`/${team.slug}`} />}
                leftAvatar={<Avatar style={teamAvatarStyle} src={team.avatar} />}
                primaryText={team.name}
                rightIconButton={teamButton(team)}
                secondaryText={this.props.intl.formatMessage(messages.joinTeam)}
              />
            ))}
          </List> :
          <CardText>
            <FormattedMessage id="switchTeams.noTeams" defaultMessage="Not a member of any team." />
          </CardText>
        }

        { isUserSelf ?
          <CardActions>
            <FlatButton
              label={<FormattedMessage id="switchTeams.newTeamLink" defaultMessage="Create Team" />}
              onClick={() => this.getContext().getContextStore().history.push('/check/teams/new')}
            />
          </CardActions> : null
        }
      </Card>
    );
  }
}

SwitchTeamsComponent.propTypes = {
  // https://github.com/yannickcr/eslint-plugin-react/issues/1389
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
  user: PropTypes.object.isRequired,
};

SwitchTeamsComponent.contextTypes = {
  store: PropTypes.object,
};

export default injectIntl(SwitchTeamsComponent);
