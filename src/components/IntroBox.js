import React from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Card, Image, Button } from 'react-bootstrap';

import FloatyButton from './FloatyButton'
import face from '../images/face.png';

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
    -webkit-text-stroke-width: 2.5px;
    -webkit-text-stroke-color: black;
    border: none !important;
    `;

  StyledImage = styled(Image).attrs(props => ({src: props.image, roundedCircle: true, fluid: true}))`
    width: 8em;
    margin-top: 1.25rem;
    border: 5px solid #fff;
  `


  render() {
    return (
      <this.StyledContainer className="d-flex h-100">
        <this.StyledCard className="align-middle text-white mx-auto d-block">
        <this.StyledImage image={face}/>
        <Card.Body>
          <Card.Title style={{fontSize: "3.5rem"}}>Hi, I'm Daniel</Card.Title>
            <Card.Text>
              <br/><span style={{fontSize: "2rem"}}>I'm a...</span><br/><span style={{fontSize: "3rem"}}>{this.props.text}</span>
            </Card.Text>
          </Card.Body>
        </this.StyledCard>
      </this.StyledContainer>
    );
  }
}

export default IntroBox;