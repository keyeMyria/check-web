import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import ProjectRoute from '../../relay/ProjectRoute';
import { Link } from 'react-router';
import Caret from '../Caret';

class ProjectBreadcrumbComponent extends Component {
  render() {
    const project = this.props.project;
    const projectUrl = ('/team/' + project.team.dbid + '/project/' + project.dbid);

    return (
      <Link to={projectUrl} className='project-breadcrumb'>
        <Caret left={true} />
        <h2 className='project-breadcrumb__project-name' title={project.description}>{project.title}</h2>
      </Link>
    );
  }
}

const ProjectBreadcrumbContainer = Relay.createContainer(ProjectBreadcrumbComponent, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id,
        dbid,
        title,
        description,
        team {
          id,
          dbid
        },
      }
    `
  }
});


class ProjectBreadcrumb extends Component {
  render() {
    var route = new ProjectRoute({ projectId: this.props.params.projectId });
    return (<Relay.RootContainer Component={ProjectBreadcrumbContainer} route={route} />);
  }
}

export default ProjectBreadcrumb;