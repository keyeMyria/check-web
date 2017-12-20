import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import IconDelete from 'material-ui/svg-icons/action/delete';
import Can from '../Can';
import CheckContext from '../../CheckContext';
import { SmallerStyledIconButton } from '../../styles/js/shared';

class TeamMenu extends Component {
  getHistory() {
    const history = new CheckContext(this).getContextStore().history;
    return history;
  }

  handleClickTrash() {
    const history = this.getHistory();
    history.push(`/${this.props.team.slug}/trash`);
  }

  render() {
    const { currentUserIsMember } = this.props;

    return (
      currentUserIsMember ?
        <SmallerStyledIconButton
          key="teamMenu.trash"
          onClick={this.handleClickTrash.bind(this)}
          tooltip={
            <FormattedMessage id="teamMenu.trash" defaultMessage="Trash" />
          }
        >
          <IconDelete />
        </SmallerStyledIconButton> : null
    );
  }
}

TeamMenu.contextTypes = {
  store: React.PropTypes.object,
};

export default TeamMenu;
