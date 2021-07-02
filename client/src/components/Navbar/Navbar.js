import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default class Navbar extends Component {
  render() {
    return (
      <div id="menu-nav">
        <div id="navigation-bar">
          <ul>
            <li>
              <Link to="/" className="navbar-brand">
                <i class="fa fa-home"></i>
                <span> j00k3r</span>
              </Link>
            </li>
            <li>
              <Link to="/blockchain" className="nav-link">
                <i class="fa fa-handshake"></i>
                <span> Blockchain</span>
              </Link>
            </li>
            <li>
              <Link to="/users" className="nav-link">
                <i class="fa fa-user"></i>
                <span> Users</span>
              </Link>
            </li>
            <li>
              <Link to="/miner" className="nav-link">
                <i class="fa fa-dollar-sign"></i>
                <span> Miner</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
