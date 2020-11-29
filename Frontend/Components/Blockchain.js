/**
 * This component contain a chain of blocks
 */
import React, { Component } from 'react'
import {default as BLKCHAIN} from '../../Models/Blockchain';

export default class Blockchain extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            blockchain:new BLKCHAIN()
        }
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
