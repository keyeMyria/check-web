import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';

class DeleteVersionMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation destroyVersion {
      destroyVersion
    }`;
  }

  getVariables() {
    return { id: this.props.id };
  }

  getFatQuery() {
    let query = '';
    switch (this.props.parent_type) {
    case 'source':
      query = Relay.QL`fragment on DestroyVersionPayload { deletedId, source { id } }`;
      break;
    case 'project_media':
      query = Relay.QL`fragment on DestroyVersionPayload { deletedId, project_media { log, log_count, last_status, last_status_obj { id } } }`;
      break;
    }
    return query;
  }

  getConfigs() {
    const fieldIds = {};
    fieldIds[this.props.parent_type] = this.props.annotated.id;

    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: fieldIds,
      },
    ];
  }
}

export default DeleteVersionMutation;
