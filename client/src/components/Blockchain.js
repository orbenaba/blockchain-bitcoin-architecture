import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios';

export default class Blockchain extends Component {
    constructor(props){
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.deleteBlockchain= this.deleteBlockchain.bind(this);



        this.state={
            chain: [],
            difficulty: 0,
            pendingTransactions: [],
            miningReward: 100,
            fromAddress:'',
            toAddress:'',
            amount:0
        }
    }
    async componentDidMount(){
        await axios.get('http://localhost:4000/blockchain')
            .then(res=>{
                if(typeof res.data.difficulty !== 'undefined'){
                    this.setState({
                        chain:res.data.chain,
                        difficulty:res.data.difficulty,
                        pendingTransactions:res.data.pendingTransactions,
                        miningReward:res.data.miningReward
                    })
                }
                //else - no blockchain created yet
            })
    }

    onFromAddressChange = (fromAddress) =>{
        this.setState({fromAddress});
    }

    onToAddressChange = (toAddress) =>{
        this.setState({toAddress});
    }

    onAmountChange = (amount) =>{
        this.setState({amount});
    }

    async onSubmit(e){
        await e.preventDefault();
        const data = {
            amount: this.state.amount,
            fromAddress: this.state.fromAddress,
            toAddress: this.state.toAddress
        }
        await axios.post('http://localhost:4000/blockchain',data)
            .then(res=>{
                console.log(res)
                this.setState({
                    chain:res.data.chain,
                    difficulty: res.data.difficulty,
                    pendingTransactions: res.data.pendingTransactions,
                    miningReward: res.data.miningReward,
                    fromAddress:res.data.fromAddress,
                    toAddress:res.data.toAddress,
                    amount:res.data.amount
                })
            })
            .catch(err=>console.error(err))
    }


    async deleteBlockchain(e){
        console.log("Deleted")
        await axios.delete('http://localhost:4000/blockchain')
            .then(res=>{
                this.setState({
                    chain: [],
                    difficulty: 0,
                    pendingTransactions: [],
                    miningReward: 100,
                    fromAddress:'',
                    toAddress:'',
                    amount:0                    
                });
            })
            .catch(err=>{
                
                console.error(err);
            })
    }

    render() {
        console.log("this.state = ",this.state)
        if(this.state.difficulty !== 0){
            return (
                <div style={{backgroundColor: 'blue',width: '100%',height: '2000px'}}>

                <h1>
                    Add transaction
                </h1>
                <div>
                <form onSubmit={this.onSubmit}>
                    <input type="text" name={this.state.fromAddress} className="formStyle" placeholder="From address - public key (required)" required onChange={e => this.onFromAddressChange(e.target.value)}/>
                    <input type="text" name={this.state.toAddress} className="formStyle" placeholder="To address - public key (required)" required onChange={e =>this.onToAddressChange(e.target.value)}/>
                    <input type="number" name={this.state.amount} className="formStyle" placeholder="Amount (required)" required onChange={e => this.onAmountChange(e.target.value)}></input>
                    <button type="submit" className="formButton">Add</button>
                </form>
                </div>
                    <div>
                        <h4 style={{color:'white'}}>difficulty: {this.state.difficulty}</h4>
                        <h4 style={{color:'white'}}>Total blocks in the chain:{this.state.chain.length}</h4>
                        <h4 style={{color:'white'}}>Pending TXs: {this.state.pendingTransactions.length}</h4>
                        <button type="submit" onClick={this.deleteBlockchain} className="btn btn-primary a-btn-slide-text">
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            <span><strong>Delete all the blockchain</strong></span>            
                        </button>
                    </div>
                </div>
            )
        }
        else{
            return (
                <div style={{backgroundColor: 'blue',width: '100%',height: '2000px'}}>
                    <h1>
                        Add transaction (the blockchain will be created automatically)
                    </h1>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <input type="text" name={this.state.fromAddress} className="formStyle" placeholder="From address - public key (required)" required onChange={e => this.onFromAddressChange(e.target.value)}/>
                            <input type="text" name={this.state.toAddress} className="formStyle" placeholder="To address - public key (required)" required onChange={e =>this.onToAddressChange(e.target.value)}/>
                            <input type="number" name={this.state.amount} className="formStyle" placeholder="Amount (required)" required onChange={e => this.onAmountChange(e.target.value)}></input>
                            <button type="submit" className="formButton">Add</button>
                        </form>
                    </div>
                    <h4 style={{color:'white'}}>Total pending TXs: {this.state.pendingTransactions.length}</h4>
                </div>
            )
        }
        
    }
}
