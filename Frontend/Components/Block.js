/**
 * This component contains at the most 4 transactions
 */

import React, { Component, Fragment } from 'react'
import {default as BLK} from '../../Models/Block';


export default class Block extends Component {
    constructor(props)
    {
        super(props);
        this.state ={
            block: new BLK(Date.now(),null,null);
        }
    }
    render() {
        return (
            <Fragment>
        
            </Fragment>
        )
    }
}
