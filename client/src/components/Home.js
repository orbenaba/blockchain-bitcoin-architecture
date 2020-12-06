import React, { Component } from 'react'
import joker from '../images/joker.png'
export default class Home extends Component {
    render() {
        return (
            <div style={{backgroundColor: 'blue',width: '100%',height: '2000px'}}>
                <h1 style={{color:'white'}}>Welcome to j00k3r c01n</h1>
            </div>
        )
    }
}
/*
style={{
    width:'100%',height:'800px',backgroundColor:'black', backgroundImage: `url("${joker}")`,backgroundRepeat: 'no-repeat',backgroundSize:'cover'
}}>*/