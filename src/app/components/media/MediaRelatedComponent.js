import React, { Component } from 'react';
import styled from 'styled-components';
import MediaRelated from './MediaRelated';
import {
  FlexRow,
} from '../../styles/js/shared';

const StyledTree = styled.div`
  margin: 0;
  width: 100%;

  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul {
    padding-left: 1em;
  }

  li {
    padding-left: 1em;
    border: 1px dashed #979797;
    border-width: 0 0 1px 1px; 
  }

  li.medias__item {
    border-bottom: 0px;
    margin-top: 0;
  }
  
  li.medias__item:last-child {
    padding-bottom: 0 !important;
  }

  .media-detail {
    margin-left: 25px;
    margin-bottom: 5px;
  }

  li p {
    margin: 0;
    background: white;
    position: relative;
    top: 0.5em; 
  }

  li ul { 
    border-top: 1px dashed #979797;
    margin-left: -1em;
    padding-left: 2em;
    margin-top: -60px;
    margin-bottom: 60px;
    width: 20px;
  }

  ul li:last-child ul {
    border-left: 1px solid white;
    margin-left: -17px;
  }
`;

class MediaRelatedComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <FlexRow>
        <StyledTree>
          <MediaRelated media={this.props.media} showNumbers />
        </StyledTree>
      </FlexRow>
    );
  }
}

export default MediaRelatedComponent;
