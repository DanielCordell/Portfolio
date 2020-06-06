import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Main from './Main';
import NavBar from './NavBar';

import '../css/App.css';
import Background from './Background';

function test() { return "test"; } // Temp

const pages = [
  { name: "About Me", path: "/", component: Main },
  { name: "Page 2", path: "/page2", component: test },
  { name: "Page 3", path: "/page3", component: test },
];

function App() {
  return (
    <Router>
      <div>
        <Background/>
        <NavBar pages={pages} />
        <Switch>
          {pages.map(page =>
            <Route exact key={page.path} path={page.path} component={page.component} />
          )}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
