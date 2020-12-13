import React from 'react'

import './Home.css';

/**
 * Dump component for the title
 */

export default function Home() {
    return (
        <div className="general">
            <h1 className="glow">Welcome to j00k3r c01n</h1>
            <h3 style={{margin:'3rem'}}>The most secured and distributed coin</h3>
            <a href="https://github.com/orbenaba" target="_blank" style={{color:'white', fontSize:'1.5rem', margin:'3rem'}}>About the creator</a>
        </div>
    )
}