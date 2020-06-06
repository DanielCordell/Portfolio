
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

export default function NavBar(props) {
  const pathName = useLocation().pathname;
  return (
    <Navbar bg="dark" variant="dark">
      <Nav style={{ flex: "auto" }} className="justify-content-center">
        {props.pages.map(page =>
          <Nav.Link key={page.path} as={Link} to={page.path} active={page.path === pathName}>{page.name}</Nav.Link>
        )};
      </Nav>
    </Navbar>
  );
};