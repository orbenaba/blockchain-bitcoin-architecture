/**
 * This component contains at the most 4 transactions
 */

import React, { Component, Fragment } from 'react'
import Transaction from './Transaction';
import {default as BLK} from '../../Models/Block';
import  {Grid } from  '@material-ui/core';

export default class Block extends Component {
    constructor(props)
    {
        super(props);
        this.state ={
            block: new BLK(Date.now(),null,null),
            

        }
    }
    render() {
        return (
            <Fragment>
                   <Grid container  direction="row">
                      {
                        block.merkleTree.treeToArray.map( item => {

                            return (
                                <Grid item > 
                                    <Transaction  props={{fromAddress:item.fromAddress, toAddress: item.toAddress, amount:item.amount}} />
                                </Grid>
                            )
                        })
                      }
                   
                   </Grid>
                              
        
            </Fragment>
        )
    }
}
