import React from 'react';
import {BrowserRouter as Router,Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
/**
 * Import here all the components
 */
import Navbar from './components/Navbar';
import Blockchain from './components/Blockchain';
import Users from './components/Users';

function App() {
  return (
    <Router>
      <div className="container">
          <Navbar></Navbar>  
          <Route path="/" exact component={Blockchain}></Route>
          <Route path="/users" exact component={Users}></Route>
          
      </div>
    </Router>  
  );
}

export default App;
