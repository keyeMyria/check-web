import React from 'react';
import Relay from 'react-relay';
import TeamRoute from '../TeamRoute';
import TeamMenu from '../../components/team/TeamMenu';

const TeamMenuContainer = Relay.createContainer(TeamMenu, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id,
        dbid,
        name,
        slug,
        permissions,
      }
    `,
  },
});

const TeamMenuRelay = (props) => {
  if (props.params.team) {
    const route = new TeamRoute({ teamSlug: props.params.team });
    return (
      <Relay.RootContainer
        Component={TeamMenuContainer}
        route={route}
        renderFetched={data => <TeamMenuContainer {...props} {...data} />}
      />
    );
  }
  return null;
};

export default TeamMenuRelay;
