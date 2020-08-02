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
    width: 40vw;
    max-width: 20em;
    margin-top: 5vh;
    text-align: center;
    background-color: #343a40dd !important;
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
          <Card.Title><h1>Hi, I'm Daniel</h1></Card.Title>
            <Card.Text>
              <br/><span style={{fontSize: "1.2em"}}>I'm a...</span><br/><span style={{fontSize: "1.5em"}}>{this.props.text}</span>
            </Card.Text>
          </Card.Body>
        </this.StyledCard>
      </this.StyledContainer>
    );
  }
}

export default IntroBox;