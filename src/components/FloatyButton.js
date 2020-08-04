import React from 'react';
import styled, { keyframes } from 'styled-components';
import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';

class FloatyButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hover: true };
  }

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
    animation: ${this.floatAnimation} 3s ease-in-out infinite;
    box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.4);
    width: 16em;
    animation-play-state: ${props => props.hover && !props.stillmode ? "play" : "paused"};
  `
  
  render() {
    const { setHighlightedButton, style, text, stillMode } = this.props;
    return (
      <this.AnimatedButton 
        onMouseEnter={() => { setHighlightedButton(); this.setState({ hover: false }); }} 
        onMouseLeave={() => this.setState({ hover: true }) } 
        hover={this.state.hover ? 1 : 0}
        stillmode={stillMode ? 1 : 0}
        style={style}>
          <h4>{text}</h4>
      </this.AnimatedButton>
    );
  }
}

export default FloatyButton;
