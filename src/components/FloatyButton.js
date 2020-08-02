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
    width: 16em;
  `
  
  render() {
    const { onHover, style, text } = this.props;
    return (
      <this.AnimatedButton onMouseEnter={onHover} style={style}><h4>{text}</h4></this.AnimatedButton>
    );
  }
}

export default FloatyButton;
