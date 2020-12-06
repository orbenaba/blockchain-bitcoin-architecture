import React, { Component } from 'react'
import {Link} from 'react-router-dom';

export default class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">j00k3r</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/blockchain" className="nav-link">Blockchain</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/users" className="nav-link">Users</Link>
                        </li>
                    </ul>                
                </div> 
            </nav>
        )
    }
}
