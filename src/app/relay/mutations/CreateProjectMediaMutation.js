import Relay from 'react-relay';
import optimisticProjectMedia from './optimisticProjectMedia';

class CreateProjectMediaMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation createProjectMedia {
      createProjectMedia
    }`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateProjectMediaPayload {
        project_mediaEdge,
        project_media,
        related_to { id, relationships },
        relationships_target { id },
        relationships_source { id },
        project { id },
        check_search_team { id, number_of_results },
        check_search_project { id, number_of_results }
      }
    `;
  }

  getOptimisticResponse() {
    return optimisticProjectMedia(this.props.title, this.props.project, this.props.context);
  }

  getVariables() {
    const vars = {
      url: this.props.url,
      quote: this.props.quote,
      quote_attributions: this.props.quoteAttributions,
      project_id: this.props.project.dbid,
    };
    if (this.props.related_to_id) {
      vars.related_to_id = this.props.related_to_id;
    }
    return vars;
  }

  getFiles() {
    return { file: this.props.image };
  }

  getConfigs() {
    let configs = [
      {
        type: 'RANGE_ADD',
        parentName: 'check_search_team',
        parentID: this.props.project.team.search_id,
        connectionName: 'medias',
        edgeName: 'project_mediaEdge',
        rangeBehaviors: {
          '': 'prepend',
        },
      },
      {
        type: 'RANGE_ADD',
        parentName: 'check_search_project',
        parentID: this.props.project.search_id,
        connectionName: 'medias',
        edgeName: 'project_mediaEdge',
        rangeBehaviors: {
          '': 'prepend',
        },
      },
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          check_search_team: this.props.project.team.search_id,
          check_search_project: this.props.project.search_id,
        },
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [Relay.QL`
          fragment on CreateProjectMediaPayload {
            project_media {
              dbid
            },
            check_search_team {
              id
            },
            check_search_project {
              id
            }
          }`,
        ],
      },
    ];

    if (this.props.related_to_id) {
      if (this.props.targets_count > 0) {
        configs = [
          {
            type: 'RANGE_ADD',
            parentName: 'relationships_target',
            parentID: this.props.relationships_target_id,
            connectionName: 'targets',
            edgeName: 'project_mediaEdge',
            rangeBehaviors: {
              '': 'prepend',
            },
          },
          {
            type: 'RANGE_ADD',
            parentName: 'relationships_source',
            parentID: this.props.relationships_source_id,
            connectionName: 'siblings',
            edgeName: 'project_mediaEdge',
            rangeBehaviors: {
              '': 'prepend',
            },
          },
        ];
      } else {
        configs = [];
      }
      configs.push({
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          related_to: this.props.related.id,
        },
      });
    }

    return configs;
  }
}

export default CreateProjectMediaMutation;
