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
            amount:0,
            miner:{}
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
                    //check out the miner
                    axios.get('http://localhost:4000/miner')
                            .then(res=>{
                                if(typeof res.data.name !== 'undefined'){
                                    this.setState({
                                        miner:res.data
                                    })
                                }
                                //else - no miner created yet
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
        //validating the info - are the addresses exist in the DB?
        const q1 = {publicKey:this.state.fromAddress};
        const q2 = {publicKey:this.state.toAddress};
        await axios.post('http://localhost:4000/isuserexist',q1)
            .then(res=>{
                console.log("this.state.fromAddress",this.state.fromAddress);
                console.log("res.data1=",res.data);
                if(res.data === true){
                    axios.post('http://localhost:4000/isuserexist',q2)
                            .then(res=>{
                                console.log("res.data2=",res.data);
                                if(res.data ===true){
                                    axios.post('http://localhost:4000/blockchain',data)
                                    .then(res=>{
                                        console.log("res.data3=",res.data);
                                        this.setState({
                                            chain:res.data.chain,
                                            difficulty: res.data.difficulty,
                                            pendingTransactions: res.data.pendingTransactions,
                                            miningReward: res.data.miningReward,
                                        })
                                    })
                                    .catch(err=>console.error(err))
                                }
                                else{
                                    console.log("TX not valid");
                                }
                            })
                }
                else{
                    console.log("TX not valid");
                }
            })
    }


    async deleteBlockchain(e){
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

    minePendingTXs = async()=>{
        axios.post('http://localhost:4000/mineblocks',this.state.miner)
            .then(res=>{
                this.setState({

                })
            })
    }

    render() {
        if(this.state.difficulty !== 0 && this.state.pendingTransactions.length >= 3){
            return (
                <div>
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

                        <button type="submit" onClick={this.minePendingTXs} className="btn btn-primary a-btn-slide-text">
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            <span><strong>Mine 4 TXs in a shout(One for the miner)</strong></span>            
                        </button>
                    </div>
                </div>
            )
        }
        else if(this.state.difficulty!==0){
            return (
                <div>
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
                    <h4 style={{color:'white'}}>* You need at least 3 TXs to the mining</h4>
                    <h4 style={{color:'white'}}>* Pay attention that if the TX is not valid, it will not be added to the blockchain</h4>
                </div>
            )
        }
        else{
            return (
                <div>
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
