import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import MediaUtil from '../media/MediaUtil';
import MappedMessage from '../MappedMessage';
import ParsedText from '../ParsedText';
import TimeBefore from '../TimeBefore';
import { Link } from 'react-router';

const messages = defineMessages({
  disclaimer: {
    id: "sourceCard.header",
    defaultMessage: "Check Source",
  },
  bridge_disclaimer: {
    id: "bridge.sourceCard.header",
    defaultMessage: "Check Source",
  },
});

class SourceCard extends React.Component {

  profileLink(user){
    let url = user.email ? 'mailto:' + user.email : '';

    if (user && user.source && user.source.accounts && user.source.accounts.edges && user.source.accounts.edges.length > 0){
      url = user.source.accounts.edges[0].node.url;
    }

    return url ? <a target="_blank" rel="noopener noreferrer" href={url}>{user.name}</a> : user.name;
  }

  render() {
    const { source } = this.props;
    const createdAt = MediaUtil.createdAt(source);

    const { team, project_id, source_id } = this.props.source;
    const sourceUrl = `/${team.slug}/project/${project_id}/source/${source_id}`;

    const byUser = (source.user && source.user.source && source.user.source.dbid && source.user.name !== 'Pender') ?
      (<FormattedMessage id="mediaDetail.byUser" defaultMessage={'by {username}'} values={{ username: this.profileLink(source.user) }} />) : '';

    source.image = source.source.image;
    source.name = source.source.name;
    source.description = source.source.description;
    source.accounts = source.source.accounts;

    return (
      <Card className="source-card">
        <CardText className="source-card__content">
          <div className="source-card__avatar">
            <img src={source.image} className="social-media-card__author-avatar" />
          </div>
          <article className="source-card__body">
            <div className="source-card__heading"><MappedMessage msgObj={messages} msgKey="disclaimer" /></div>

            <div className="source-card__name">
              <Link to={sourceUrl} className="header__app-link">{ source.name }</Link>
            </div>

            <div className="source-card__description"><ParsedText text={source.description} /></div>

            <div className="source-card__accounts">
              <ul>
                { source.accounts.edges.map(account => {
                  return <li key={account.node.id} className="source-card__account-link">
                    { MediaUtil.socialIcon(account.node.provider + '.com') /*TODO: refactor */ }
                    <a href={ account.node.url } target="_blank" rel="noopener noreferrer">
                      { account.node.embed.username }
                    </a>
                  </li>
                }) }
              </ul>
            </div>
          </article>
          <div className="media-detail__check-metadata source-card__footer">
            {byUser ? <span className="media-detail__check-added-by"><FormattedMessage id="mediaDetail.added" defaultMessage={'Added {byUser}'} values={{ byUser }} /> </span> : null}
            {createdAt ? <span className="media-detail__check-added-at">
              <Link to={sourceUrl} className="media-detail__check-timestamp"><TimeBefore date={createdAt} /></Link>
            </span> : null}
          </div>
        </CardText>
      </Card>
    );
  }
}

export default SourceCard;
