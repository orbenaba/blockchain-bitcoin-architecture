import React, { Component } from 'react'
import axios from 'axios';
import './Miner.css'

export default class Miner extends Component {
    constructor(props){
        super(props);

        this.onMoneyChange = this.onMoneyChange.bind(this);
        this.deleteMiner = this.deleteMiner.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state={
            publicKey:'',
            privateKey:'',
            name:'',
            money:0
        }
    }

    componentDidMount(){
        axios.get('http://localhost:4000/miner')
                .then(res=>{
                    if(typeof res.data.publicKey !== 'undefined'){
                        this.setState({publicKey:res.data.publicKey,privateKey:res.data.privateKey,name:res.data.name,money:res.data.money});
                    }
                })
    }

    onNameChange = (name) =>{
        this.setState({name});
    }

    onMoneyChange(money){
        this.setState({money})
    }

    async deleteMiner(e){
        await axios.delete('http://localhost:4000/miner')
            .then(res=>{
                this.setState({publicKey:""});
            })
    }

    async onSubmit(e){
        await e.preventDefault();
        const data = {
            name: this.state.name,
            money: this.state.money
        }
        console.log("data=",data)
        await axios.post('http://localhost:4000/miner',data)
            .then(res=>{
                console.log(res)
                this.setState({
                    publicKey:res.data.publicKey,
                    privateKey:res.data.privateKey,
                    name: res.data.name,
                    money: res.data.money
                })
            })
            .catch(err=>console.error(err))
    }

    render() {
        if(this.state.publicKey === ''){
            return (
                <div>
                    <h1>
                        Create Miner
                    </h1>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <input type="text" name={this.state.name} className="formStyle" placeholder="Name (required)" required onChange={e => this.onNameChange(e.target.value)}/>
                            <input type="number" name={this.state.money} className="formStyle" placeholder="Initial amount (required)" required onChange={e =>this.onMoneyChange(e.target.value)}/>
                            <button type="submit" className="formButton">Create</button>
                        </form>
                    </div>
                </div>
            )            
        }
        else{
            return (
                <div style={{backgroundColor: 'blue',width: '100%',height: '2000px'}}>
                <div className="well">
                    <form onSubmit={this.deleteMiner} className="form-horizontal">
                        <h2 className="text-center" style={{color:'white'}}>Hello {this.state.name}</h2>
                        <hr />
                        <div className="form-group">
                            <label for="Money" className="control-label col-sm-3" style={{color:'white'}}>Money:</label>
                            <div className="form-control-static col-sm-7">
                            <label style={{color:'white'}}>{this.state.money}</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="publicKey" className="control-label col-sm-3" style={{color:'white'}}>Public Key:</label>
                            <div className="form-control-static col-sm-3">
                                <label style={{color:'white'}}>{this.state.publicKey}</label>
                            </div>
                            <label for="privateKey" className="control-label col-sm-1" style={{color:'white'}}>Private Key:</label>
                            <div className="form-control-static col-sm-3">
                            <label style={{color:'white'}}>{this.state.privateKey}</label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary a-btn-slide-text">
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            <span><strong>Delete Miner</strong></span>            
                        </button>      
                    </form>          
                 </div>
                </div>
            )
        }
    }
}
