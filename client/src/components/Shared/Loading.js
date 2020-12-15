import React from 'react'
import Loader from 'react-loader-spinner';

export default function Loading(props) {
    if(props.flag === false)
    {
        return (
            <div style={{width:'100%', height:'100%',display:'flex', justifyContent:'center', alignItems:'center'}}>
                <Loader type="ThreeDots" color="#2BAD60" height="200" width="200"/>
            </div>
       )
    }
    else{
        return (
            <div style={{width:'100%', height:'100%',display:'flex', justifyContent:'center', alignItems:'center'}}>
                <h1 style={{color:'white'}}>Mining ...</h1>
                <Loader type="ThreeDots" color="#2BAD60" height="200" width="200"/>
            </div>
       )
    }
    
}