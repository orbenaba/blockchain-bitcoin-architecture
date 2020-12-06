import React, { Component } from 'react'
import axios from 'axios';

export default class Users extends Component {
    constructor(props){
        super(props);

        /**
         * Binding this to the class
         */
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeMoney = this.onMoneyChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state={
            publicKey:'',
            privateKey:'',
            name:'',
            money:1000
        }
    }
    /**
     * This methods are called before the page is loaded 
     */
    componentDidMount(){
        axios.get('http://localhost:5000/users')
        .then(res=>{
            this.setState({
                
            })    
        })
    }

    /**
     * When the name is changed we wish to set the state of the component
     */
    onChangeName(e){
        this.setState({
            name:e.target.value
        })
    }

    onMoneyChange(e){
        this.setState({ 
            money:e.target.money
        })
    }

    onSubmit(e){
        e.preventDefault();
        const u ={
            publicKey: this.state.publicKey,
            privateKey: this.state.privateKey,
            name: this.state.name,
            money: this.state.money
        }
        /**
         * Here we are keeping the user in the DB
         */
        axios.post('http://localhost:5000/users', u)
            .then(res=>console.log(res.data))
         /**
         * Here we are keeping the user in the DB
         */
        this.setState({
            publicKey:"",
            privateKey:"",
            money:"",
            name:""
        })        
    }

    render() {
        return (
            <div>
                <h1>Users Component</h1>
            </div>
        )
    }
}
