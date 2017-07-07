import config from 'config';

export function optimisticProjectMedia(title, project, context) {      
  const user = context && context.currentUser ? context.currentUser : {};
  const team = context && context.team ? context.team : {};

  return {
    project_mediaEdge: {
      node: {
        dbid: 0,
        language: null,
        url: '',
        quote: '',
        published: parseInt((new Date().getTime() / 1000)).toString(),
        embed: JSON.stringify({ title }),
        log_count: 1,
        verification_statuses: "{\"label\":\"Status\",\"default\":\"undetermined\",\"statuses\":[]}",
        translation_statuses: "{\"label\":\"Translation Status\",\"default\":\"pending\",\"statuses\":[]}",
        last_status: 'undetermined',
        field_value: 'pending',
        overridden: "{\"title\":true,\"description\":false,\"username\":false}",
        project_id: project.dbid,
        id: "UHJvamVjdE1lZGlhLzA=\n",
        language_code: null,
        domain: '',
        permissions: "{\"read ProjectMedia\":true,\"update ProjectMedia\":false,\"destroy ProjectMedia\":false,\"create Comment\":false,\"create Flag\":false,\"create Status\":false,\"create Tag\":false,\"create Dynamic\":false,\"create Task\":false}",
        project: {
          id: project.id,
          dbid: project.dbid,
          title: project.title
        },
        media: {
          url: null,
          quote: '',
          embed_path: '//' + config.selfHost + '/images/loading.gif',
          thumbnail_path: '//' + config.selfHost + '/images/loading-thumb.gif',
          id: "TWVkaWEvMA==\n"
        },
        user: {
          name: user.name,
          source: {
            dbid: 0,
            id: "U291cmNlLzA=\n"
          },
          id: "VXNlci8w\n"
        },
        team: {
          slug: team.slug,
          id: "VGVhbS8w\n"
        },
        tags: {
          edges: []
        },
        tasks: {
          edges: []
        },
        log: {
          edges: []
        }
      }
    },
    project_media: {
      dbid: 0,
      id: "UHJvamVjdE1lZGlhLzA=\n"
    }
  }
}
