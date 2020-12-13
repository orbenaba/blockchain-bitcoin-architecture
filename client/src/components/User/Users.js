import React, { Component } from 'react'
import axios from 'axios';

 const User = props =>(
     <tr>
        <td>{props.userParam.name}</td>
        <td style={{color:'rgb(172, 224, 0)'}}>{props.userParam.money}</td>
        <td style={{color:'yellow'}}>{props.userParam.publicKey}</td>
    </tr>
 )

export default class Users extends Component {

    constructor(props){
        super(props);


        this.onSubmit = this.onSubmit.bind(this);

        this.state={
            publicKey:'',
            privateKey:'',
            name:'',
            money:1000,
            oldUsers:[]
        }
    }

    componentDidMount(){
        axios.get('http://localhost:4000/users')
        .then(res=>{
            this.setState({
                oldUsers:res.data 
            })    
        })
        .catch(err=>console.error(err))
    }

    onNameChange = (name) =>{
        this.setState({name});
    }

    onMoneyChange(money){
        this.setState({money})
    }
    async onSubmit(e){
        await e.preventDefault();
        const data = {
            name: this.state.name,
            money: this.state.money
        }
        await axios.post('http://localhost:4000/users',data)
            .then(res=>{
                console.log(res)
                this.setState({
                    publicKey:res.data.publicKey,
                    privateKey:res.data.privateKey,
                    name: res.data.name,
                    money: res.data.money,
                })
            })
            .catch(err=>console.error(err))
    }

    getUsersList =()=>{
        return this.state.oldUsers.map(u => {
            return <User userParam={u}></User>
        })
    }

    deleteAll = ()=>{
        axios.delete('http://localhost:4000/users')
            .then(res=>{
                this.setState({
                    publicKey:'',
                    privateKey:'',
                    name:'',
                    money:1000,
                    oldUsers:[]
                })
            })
    }

    render() {
        if(this.state.oldUsers.length !== 0){
            return (           
                <div>
                    <h1 className="glow">users</h1>
                    <div>
                        <form onSubmit={this.onSubmit} >
                            <input type="text" name={this.state.name} className="formStyle" placeholder="Name" required onChange={e => this.onNameChange(e.target.value)}/>
                            <input type="number" style={{width:'10rem'}} name={this.state.money} className="formStyle" placeholder="Amount" required onChange={e =>this.onMoneyChange(e.target.value)}/>
                            <br></br>
                            <button type="submit" className="formButton">Create</button>
                        </form>
                    </div>
    
    
                    <div>
                        <table className="table general" style={{textAlign:'center'}}>
                            <thead className="thead-dark">
                                <tr>
                                    <th>Name</th>
                                    <th style={{color:'rgb(172, 224, 0)'}}>Money<b className="JKC">(JKC)</b></th>
                                    <th style={{color:'yellow'}}>Wallet</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.getUsersList()}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <button type="submit" onClick={()=>{if (window.confirm('Are you sure you wish to delete all the users?')) this.deleteAll()}} className="formButton">Delete all users</button>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h1 className="glow">Create user</h1>
                    <div>
                        <form onSubmit={this.onSubmit} >
                            <input type="text" name={this.state.name} className="formStyle" placeholder="Name" required onChange={e => this.onNameChange(e.target.value)}/>
                            <input type="number" style={{width:'10rem'}} name={this.state.money} className="formStyle" placeholder="Amount" required onChange={e =>this.onMoneyChange(e.target.value)}/>
                            <br></br>
                            <button type="submit" className="formButton">Create</button>
                        </form>
                    </div>
                </div>
            )
        }
    }
}