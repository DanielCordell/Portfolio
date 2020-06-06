import React from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';

class Header extends React.Component {
  styledContainer = styled(Container)`
    `;

  styledHeaderImage = styled.img`
      height: 20em;
    `;

  render() {
    return (
      <>
        <this.styledContainer>
          <this.styledHeaderImage id="img" src="https://ichef.bbci.co.uk/images/ic/960x960/p08634k6.jpg" />
        </this.styledContainer>
      </>
    );
  }
}

export default Header;