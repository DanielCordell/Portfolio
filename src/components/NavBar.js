
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, Navbar, FormCheck } from 'react-bootstrap';
import styled from 'styled-components';

const StyledFormCheck = styled(FormCheck)`
  position: absolute !important;
  color: rgba(255,255,255,.5);
  &:hover {
    color: rgba(255,255,255,.75);
  }
`;

export default function NavBar(props) {
  const pathName = useLocation().pathname;


  return (
    <Navbar bg="dark" variant="dark" style={{fontFamily: "'Titillium Web', sans-serif"
  }}>
      <StyledFormCheck aria-label="Enable Still Mode" id="stillmode" label="Still Mode" style={{ userSelect: "none" }} onChange={(e) => props.setStillMode(e.target.checked)}/>
      <Nav style={{ flex: "auto" }} className="justify-content-center">
        {props.pages.map(page =>
          <Nav.Link key={page.path} as={Link} to={page.path} active={page.path === pathName}>{page.name}</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
};