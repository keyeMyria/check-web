import React from 'react';
import FaFacebookSquare from 'react-icons/lib/fa/facebook-square';
import FaInstagram from 'react-icons/lib/fa/instagram';
import FaTwitter from 'react-icons/lib/fa/twitter';
import FaYoutubePlay from 'react-icons/lib/fa/youtube-play';
import MdLink from 'react-icons/lib/md/link';
import { defineMessages } from 'react-intl';
import config from 'config'; // eslint-disable-line require-path-exists/exists
import { nested, truncateLength } from '../../helpers';

const messages = defineMessages({
  notesCount: {
    id: 'media.notesCount',
    defaultMessage: '{notesCount, plural, =0 {No notes} one {1 note} other {# notes}}',
  },
  typeTwitter: {
    id: 'media.typeTwitter',
    defaultMessage: 'Tweet',
  },
  typeFacebook: {
    id: 'media.typeFacebook',
    defaultMessage: 'Facebook post',
  },
  typeInstagram: {
    id: 'media.typeInstagram',
    defaultMessage: 'Instagram',
  },
  typeVideo: {
    id: 'media.typeVideo',
    defaultMessage: 'Video',
  },
  typeClaim: {
    id: 'media.typeClaim',
    defaultMessage: 'Claim',
  },
  bridge_typeClaim: {
    id: 'bridge.media.typeClaim',
    defaultMessage: 'Quote',
  },
  typeImage: {
    id: 'media.typeImage',
    defaultMessage: 'Image',
  },
  typePage: {
    id: 'media.typePage',
    defaultMessage: 'Page',
  },
  onDomain: {
    id: 'media.onDomain',
    defaultMessage: '{typeLabel} on {domain}',
  },
  byAttribution: {
    id: 'media.byAttribution',
    defaultMessage: '{typeLabel} by {attribution}',
  },
  withText: {
    id: 'media.withText',
    defaultMessage: '{typeLabel}: {text}',
  },
  favoritesCount: {
    id: 'media.favoritesCount',
    defaultMessage: '{favoritesCount, plural, one {1 favorite} other {# favorites}}',
  },
  retweetsCount: {
    id: 'media.retweetsCount',
    defaultMessage: '{retweetsCount, plural, one {1 retweet} other {# retweets}}',
  },
});

const MediaUtil = {
  url(media, data) {
    try {
      return media.url || data.url || '';
    } catch (e) {
      return '';
    }
  },

  authorName(media, data) {
    return data.author_name || media.domain;
  },

  authorUsername(media, data) {
    return data.username;
  },

  sourceName(media) {
    try {
      return media.project_source.source.name;
    } catch (e) {
      return '';
    }
  },

  mediaType(media) {
    let type = null;
    try {
      const socialMedia = {
        'twitter.com': messages.typeTwitter,
        'facebook.com': messages.typeFacebook,
        'instagram.com': messages.typeInstagram,
        'youtube.com': messages.typeVideo,
      }[media.domain];

      if (socialMedia) {
        type = socialMedia;
      } else if (media.media.quote) {
        type = config.appName === 'check' ? messages.typeClaim : messages.bridge_typeClaim;
      } else if (media.media.embed_path) {
        type = messages.typeImage;
      } else if (media.domain) {
        type = messages.typePage;
      }
    } catch (e) {
      type = messages.typePage;
    }
    return type;
  },

  // Return a CSS-friendly media type.
  mediaTypeCss(media, data) {
    const type = this.mediaType(media, data);
    return type ? type.id.replace(/^.*media\.type/, '').toLowerCase() : '';
  },

  typeLabel(media, data, intl) {
    const type = this.mediaType(media, data);
    return type ? intl.formatMessage(type) : '';
  },

  hasCustomTitle(mediaParam, data) {
    const title = data && data.title && data.title.trim();
    const media = mediaParam;
    if (typeof media.overridden === 'string') {
      media.overridden = JSON.parse(media.overridden);
    }
    return nested(['overridden', 'title'], media) || (title && media.quote && (title !== media.quote));
  },

  hasCustomDescription(media, data) {
    const description = data && data.description && data.description.trim();
    return nested(['overridden', 'description'], media) || // Link type report
      (media.quote && (description !== media.quote)) || // Quote type report
      (media.embed_path && description); // Image type report
  },

  title(media, data, intl) {
    if (this.hasCustomTitle(media, data)) {
      return truncateLength(data.title);
    }

    const type = this.mediaType(media, data);

    const typeLabel = type ? intl.formatMessage(type) : '';
    const attribution = this.authorName(media, data);
    const byAttribution = attribution
      ? intl.formatMessage(messages.byAttribution, { typeLabel, attribution })
      : typeLabel;

    let displayTitle = '';

    switch (type) {
    case messages.typePage:
      displayTitle = nested(['media', 'embed', 'title'], media) ||
      intl.formatMessage(messages.onDomain, { typeLabel, domain: media.domain });
      break;
    case messages.typeClaim:
    case messages.typeQuote:
      displayTitle = media.media.quote;
      break;
    case messages.typeImage:
      displayTitle = data.title;
      break;
    case messages.typeFacebook:
    case messages.typeTwitter:
    case messages.typeInstagram:
    case messages.typeVideo:
      displayTitle = nested(['media', 'embed', 'title'], media) || byAttribution;
      break;
    default:
      displayTitle = media.media.quote || data.title || byAttribution || '';
    }

    return truncateLength(displayTitle);
  },

  // Return a text fragment "X notes" with proper pluralization.
  notesCount(media, data, intl) {
    return intl.formatMessage(messages.notesCount, { notesCount: media.log_count });
  },

  createdAt(media) {
    // check media
    let date = null;
    try {
      date = new Date(parseInt(media.published, 10) * 1000);
      if (Number.isNaN(date.valueOf())) {
        date = null;
      }
    } catch (e) {
      date = null;
    }
    return date;
  },

  embedPublishedAt(media, data) {
    // embedded media
    let date = null;
    try {
      date = new Date(data.published_at);
      if (Number.isNaN(date.valueOf())) {
        date = null;
      }
    } catch (e) {
      date = null;
    }
    return date;
  },

  socialIcon(domain) {
    switch (domain) {
    case 'twitter.com':
      return <FaTwitter alt={domain} key="socialIcon__Twitter" />;
    case 'youtube.com':
      return <FaYoutubePlay alt={domain} key="socialIcon__Youtube" />;
    case 'instagram.com':
      return <FaInstagram alt={domain} key="socialIcon__Instagram" />;
    case 'facebook.com':
      return <FaFacebookSquare alt={domain} key="socialIcon__Facebook" />;
    default:
      return <MdLink alt="link" key="socialIcon__Link" />;
    }
  },
};

export default MediaUtil;
