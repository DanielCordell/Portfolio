import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Main from './Main';
import NavBar from './NavBar';

import '../css/App.css';
import Background from './Background';

import colourSchemes from '../colourSchemes';

function test() { return "test"; } // Temp

const pages = [
  { name: "About Me", path: "/", component: Main },
  { name: "Page 2", path: "/page2", component: test },
  { name: "Page 3", path: "/page3", component: test },
];

function App() {

  const [colourSchemeIndex, setColourSchemeIndex] = useState(0)

  return (
    <Router>
      <div>
        <Background colourSchemes={colourSchemes} colourSchemeIndex={colourSchemeIndex}/>
        <NavBar pages={pages} />
        <Switch>
          {pages.map(page =>
            <Route exact key={page.path} path={page.path} render={(props) => <page.component {...props} colourSchemes={colourSchemes}/>} />
          )}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
