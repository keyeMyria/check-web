import React from 'react';
import Relay from 'react-relay';
import {
  defineMessages,
  injectIntl,
  intlShape,
} from 'react-intl';
import CreateTeamCard from './CreateTeamCard';
import FindTeamCard from './FindTeamCard';
import PageTitle from '../PageTitle';
import {
  ContentColumn,
} from '../../styles/js/shared';
import TeamRoute from '../../relay/TeamRoute';
import RelayContainer from '../../relay/RelayContainer';

const messages = defineMessages({
  titleCreate: {
    id: 'addTeamPage.titleCreate',
    defaultMessage: 'Create a Team',
  },
  titleFind: {
    id: 'addTeamPage.titleFind',
    defaultMessage: 'Find an existing team',
  },
});

class AddTeamComponent extends React.Component {
  componentWillReceiveProps() {
    console.log('this.props');
    console.log(this.props);
  }

  render() {
    const mode = this.props.route.path === 'check/teams/find(/:slug)' ? 'find' : 'create';

    const title = mode === 'find' ? messages.titleFind : messages.titleCreate;

    return (
      <PageTitle
        prefix={this.props.intl.formatMessage(title)}
        skipTeam
      >
        <main className="create-team">
          <ContentColumn narrow>
            { mode === 'find' ?
              <FindTeamCard
                relay={this.props.relay}
              />
              : <CreateTeamCard />
            }
          </ContentColumn>
        </main>
      </PageTitle>
    );
  }
}

AddTeamComponent.propTypes = {
  // https://github.com/yannickcr/eslint-plugin-react/issues/1389
  // eslint-disable-next-line react/no-typos
  intl: intlShape.isRequired,
};

const AddTeamContainer = Relay.createContainer(injectIntl(AddTeamComponent), {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id,
        dbid,
        slug,
      }
    `,
  },
});

const AddTeam = (props) => {
  const route = new TeamRoute({ teamSlug: props.params.slug });
  return (
    <RelayContainer
      Component={AddTeamContainer}
      route={route}
      renderFetched={data => <AddTeamContainer {...props} {...data} />}
    />
  );
};

export default AddTeam;