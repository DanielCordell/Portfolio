import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Button } from 'react-bootstrap';

class FloatyButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = { hover: true, flyingIn: true };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stillMode && this.state.flyingIn) this.setState({ flyingIn: false });
  }

  floatAnimation = keyframes`
    0% {
      transform: translatey(0px);
    }
    50% {
      transform: translatey(-25px);
    }
    100% {
      transform: translatey(0px);
    }
  `;

  flyInAnimation = keyframes`
    0% {
      transform: translatey(70vh);
    }
    100%{
      transform: translatey(0%);
    }
  `;
  
  AnimatedButton = styled(Button)`
    animation: ${props => !props.flyingin ? css`${this.floatAnimation} 3s ease-in-out infinite` : css`${this.flyInAnimation} 3s cubic-bezier(0,0,0.58,1)`} ;
    box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.4);
    width: 16em;
    animation-play-state: ${props => props.hover && !props.stillmode ? "running" : "paused"};
    animation-delay: ${props => props.flyingin ? "" : "0s!important"}
    will-change: transform;
  `
  
  render() {
    const { setHighlightedButton, style, text, stillMode } = this.props;
    return (
      <this.AnimatedButton 
        onMouseEnter={() => { setHighlightedButton(); this.setState({ hover: false }); }} 
        onMouseLeave={() => this.setState({ hover: true }) } 
        onAnimationEnd={() => this.setState({ flyingIn: false })}
        hover={this.state.hover ? 1 : 0}
        stillmode={stillMode ? 1 : 0}
        flyingin={this.state.flyingIn ? 1 : 0}
        style={style}>
          <h4>{text}</h4>
      </this.AnimatedButton>
    );
  }
}

export default FloatyButton;
