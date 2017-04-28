import React, { Component, PropTypes } from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Relay from 'react-relay';
import CreateStatusMutation from '../../relay/CreateStatusMutation';
import UpdateStatusMutation from '../../relay/UpdateStatusMutation';
import CheckContext from '../../CheckContext';
import MediaStatusCommon from './MediaStatusCommon';

class MediaStatus extends MediaStatusCommon {
  setStatus(context, media, status) {
    const onFailure = (transaction) => { context.fail(transaction); };
    const onSuccess = (response) => { context.success('status'); };

    const store = new CheckContext(this).getContextStore();

    let status_id = '';
    if (media.last_status_obj !== null) {
      status_id = media.last_status_obj.id;
    }
    const status_attr = {
      parent_type: 'project_media',
      annotated: media,
      annotator: store.currentUser,
      context: store,
      annotation: {
        status,
        annotated_type: 'ProjectMedia',
        annotated_id: media.dbid,
        status_id,
      },
    };

    // Add or Update status
    if (status_id && status_id.length) {
      Relay.Store.commitUpdate(
        new UpdateStatusMutation(status_attr),
        { onSuccess, onFailure },
      );
    } else {
      Relay.Store.commitUpdate(
        new CreateStatusMutation(status_attr),
        { onSuccess, onFailure },
      );
    }
  }

  fail(transaction) {
    const that = this;
    const error = transaction.getError();
    let message = this.props.intl.formatMessage(messages.error);
    try {
      const json = JSON.parse(error.source);
      if (json.error) {
        message = json.error;
      }
    } catch (e) { }
    that.setState({ message });
  }

  success(response) {
    // this.setState({ message: 'Status updated.' });
  }
}

MediaStatus.propTypes = {
  intl: intlShape.isRequired,
};

MediaStatus.contextTypes = {
  store: React.PropTypes.object,
};

export default injectIntl(MediaStatus);
