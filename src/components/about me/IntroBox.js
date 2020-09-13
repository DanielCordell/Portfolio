import React from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Card, Image } from 'react-bootstrap';

import face from '../../images/face.png';

class IntroBox extends React.Component {
  StyledContainer = styled(Container)`
    font-family: 'Titillium Web', sans-serif;
  `;

  StyledCard = styled(Card)`
    width: 60vw;
    max-width: 40em;
    margin-top: 5vh;
    text-align: center;
    background-color: #ffffff00 !important;
    border: none !important;
  `;

  StyledImage = styled(Image).attrs(props => ({src: props.image, roundedCircle: true, fluid: true}))`
    width: 12em;
    margin-top: 1.25rem;
  `;

  render() {
    return (
      <this.StyledContainer className="d-flex h-100">
        <this.StyledCard className="align-middle text-white mx-auto d-block">
        <this.StyledImage image={face}/>
        <Card.Body>
          <Card.Title style={{fontSize: "3.5rem"}}>Hi, I'm Daniel</Card.Title>
            <Card.Text>
              <br/><span style={{fontSize: "2.5rem"}}>I'm a...</span><br/><span style={{fontSize: "3rem"}}>{this.props.text}</span>
            </Card.Text>
          </Card.Body>
        </this.StyledCard>
      </this.StyledContainer>
    );
  }
}

export default IntroBox;