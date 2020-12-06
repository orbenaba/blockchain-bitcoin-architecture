import React from 'react';
import {BrowserRouter as Router,Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
/**
 * Import here all the components
 */
import Navbar from './components/Navbar';
import Blockchain from './components/Blockchain';
import Users from './components/Users';
import Home from './components/Home.js';
import Miner from './components/Miner';

function App() {
  return (
    <div className="container" style={{width:"1500px"}}>
      <Router>
            <Navbar></Navbar>  
            <Route path="/" exact component={Home}></Route>
            <Route path="/blockchain" exact component={Blockchain}></Route>
            <Route path="/users" exact component={Users}></Route>
            <Route path="/miner" exact component={Miner}></Route>
      </Router>  
    </div>
  );
}

export default App;
