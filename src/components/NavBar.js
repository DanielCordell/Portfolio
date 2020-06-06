
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';

export default function NavBar(props) {
  return (
    <Navbar bg="dark" variant="dark">
      <Nav className="mr-auto">
        {props.pages.map(page => 
          <Nav.Link key={page.path} as={Link} to={page.path}>{page.name}</Nav.Link>
        )};
      </Nav>
    </Navbar>
  );
};