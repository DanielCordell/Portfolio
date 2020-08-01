import React from 'react';
import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';

class FloatyButton extends React.Component {
  floatAnimation = keyframes`
    0% {
      transform: translatey(0px);
    }
    50% {
      transform: translatey(-20px);
    }
    100% {
      transform: translatey(0px);
    }
  `;
  
  AnimatedButton = styled(Button)`
    animation: ${this.floatAnimation} 2s ease-in-out infinite;
    box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.4);
    position: fixed;
    left: ${this.props.left};
    top: ${this.props.top};
  `
  
  render() {
    return (
      <this.AnimatedButton><h3>{this.props.text}</h3></this.AnimatedButton>
    );
  }
}

export default FloatyButton;
