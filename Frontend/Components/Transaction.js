/**
 * This component has a state, which contain the next attributes:
 *      Date of mining
 *      source address Transaction
 *      dest address Transaction
 *      amount of money
 */
import React, { Component } from 'react'
import {default as TX} from '../../Models/Transaction';

export default class Transaction extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            //dummy values
            tran: new TX("2.2.2.2","1.1.1.1", 1000)
        }
    }
    render() {
        return (
            <div>
                <h1>Transaction</h1>
                <h2>SrcAdd: {this.state.tran.fromAddress}</h2>
                <h2>DstAdd: {this.state.tran.toAddress}</h2>
                <h2>Amount:{this.state.tran.amount}</h2>
            </div>
        )
    }
}
