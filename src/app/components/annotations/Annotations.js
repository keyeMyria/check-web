import React from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Card, CardActions } from 'material-ui/Card';
import styled from 'styled-components';
import rtlDetect from 'rtl-detect';
import TimelineHeader from './TimelineHeader';
import AddAnnotation from './AddAnnotation';
import Annotation from './Annotation';
import { units, black16, black38, white, opaqueBlack16, borderWidthMedium, Text } from '../../styles/js/shared';

const messages = defineMessages({
  timelineTitle: {
    id: 'mediaComponent.verificationTimeline',
    defaultMessage: 'Verification Timeline',
  },
  bridge_timelineTitle: {
    id: 'bridge.mediaComponent.verificationTimeline',
    defaultMessage: 'Translation Timeline',
  },
});

const StyledAnnotation = styled.div`
  display: flex;
  flex-direction: column;
  .annotations__list {
    // Chrome only hack to avoid broken scroll on Firefox :( CGB 2017-10-6
    // TODO Figure out a real solution for this
    // https://github.com/philipwalton/flexbugs/issues/108
    @media screen and (-webkit-min-device-pixel-ratio:0) {
      height: ${props => props.height === 'short'
    ? 'calc(100vh - 580px);'
    : 'calc(100vh - 300px);'
};
    }
    min-height: 250px;
    overflow: auto;
    display: flex;
    // Scroll the log to the bottom
    flex-direction: column-reverse;
    border-top: 1px solid ${black16};
    border-bottom: 1px solid ${black16};

    .annotations__list-item {
      position: relative;
      margin: 0 ${units(1)};
      // The timeline line
      &::before {
        background-color: ${opaqueBlack16};
        bottom: 0;
        content: '';
        display: block;
        position: absolute;
        top: 0;
        width: ${borderWidthMedium};
        ${props => (props.isRtl ? 'right' : 'left')}: ${units(4)};
      }
      &:first-of-type {
        padding-bottom: ${units(6)};
      }
      &:last-of-type {
        margin-top: ${units(6)};
      }
    }
  }
`;

const StyledAnnotationCardActions = styled(CardActions)`
  margin-top: auto;
  background-color: ${white};
`;

const Annotations = props => (
  <StyledAnnotation
    className="annotations"
    isRtl={rtlDetect.isRtlLang(props.intl.locale)}
    height={props.height}
  >
    <Card>
      <TimelineHeader msgObj={messages} msgKey="timelineTitle" />
      <div className="annotations__list">
        {!props.annotations.length ?
          <Text style={{ margin: 'auto', color: black38 }}>
            <FormattedMessage id="annotation.noAnnotationsYet" defaultMessage="No annotations yet" />
          </Text> :
          props.annotations.map(annotation => (
            <div key={annotation.node.dbid} className="annotations__list-item">
              <Annotation
                annotation={annotation.node}
                annotated={props.annotated}
                annotatedType={props.annotatedType}
              />
            </div>))}
      </div>
      <StyledAnnotationCardActions>
        <AddAnnotation
          annotated={props.annotated}
          annotatedType={props.annotatedType}
          types={props.types}
        />
      </StyledAnnotationCardActions>
    </Card>
  </StyledAnnotation>);

export default injectIntl(Annotations);
