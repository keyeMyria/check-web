import React from 'react';
import DocumentTitle from 'react-document-title';
import { injectIntl } from 'react-intl';
import { mapGlobalMessage } from './MappedMessage';

const PageTitle = (props) => {
  let { title } = props;

  if (!title) {
    const appName = mapGlobalMessage(props.intl, 'appNameHuman');
    let suffix = appName;

    if (!props.skipTeam) {
      try {
        suffix = `${props.team.name} ${appName}`;
      } catch (e) {
        // Do nothing.
      }
    }

    title = (props.prefix ? (`${props.prefix} | `) : '') + suffix;
  }

  return (
    <DocumentTitle title={title}>
      {props.children}
    </DocumentTitle>
  );
};

export default injectIntl(PageTitle);
