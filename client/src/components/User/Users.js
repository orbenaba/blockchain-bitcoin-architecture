import {React, useEffect, useState} from 'react'
import axios from 'axios';
import Loader from '../Shared/Loading';

const User = props =>(
    <tr>
       <td>{props.userParam.name}</td>
       <td >{props.userParam.money}</td>
       <td >0x{props.userParam.publicKey}</td>
   </tr>
)


export default function Users() {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [money, setMoney] = useState(1000);
    const [name, setName] = useState('');
    const [oldUsers, setOldUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(async()=>{
        const res = await axios.get('http://localhost:4000/users');
        setOldUsers(res.data);
        setLoading(false);
    },[])


    function onNameChange(name){
        setName(name);
    }

    function onMoneyChange(money){
        setMoney(money);
    }
    async function onSubmit(e){
        await e.preventDefault();
        const data = {name,money};
        await axios.post('http://localhost:4000/users',data)
            .then(res=>{
                //Clearing the form right after the Data has been added to the DB
                document.formInput.reset();
                //updating the table
                setOldUsers([...oldUsers, res.data]);
                setPublicKey('');
                setPrivateKey('');
                setName('');
                setMoney('');
            })
            .catch(err=>console.error(err))
    }

    function getUsersList(){
        return oldUsers.map(u => {
            return <User userParam={u}></User>
        })
    }


    function deleteAll(){
        axios.delete('http://localhost:4000/users')
            .then(res=>{
                    setPublicKey('');
                    setPrivateKey('');
                    setName('');
                    setMoney(1000);
                    setOldUsers([]);
                })
    }

    let form = (<div>
                    <form name="formInput" onSubmit={onSubmit} >
                        <input type="text" name={name} className="formStyle" placeholder="Name" minLength="2" maxLength="30" required onChange={e => onNameChange(e.target.value)}/>
                        <input type="number" style={{width:'10rem'}} name={money} className="formStyle" placeholder="Amount" minLength="1" maxLength="12" required onChange={e => onMoneyChange(e.target.value)}/>
                        <br></br>
                        <button type="submit" className="btn formButton" style={{marginBottom:'2rem'}}>Create</button>
                    </form>
                </div>
                )
    
    if(loading){
        return (
            <Loader flag={false}></Loader>
        )
    }

    if(oldUsers.length !== 0){
        return (           
            <div>
                <h1 className="glow text-center">users</h1>
                {form}
                <div>
                    <button type="submit" className="btn btn-danger delete-btn" style={{marginBottom:'3rem',marginTop:'-6rem',position:'relative',left:'45rem'}} onClick={()=>{if (window.confirm('Are you sure you wish to delete all the users?')) deleteAll()}}>
                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    <span><strong>Delete All</strong></span>            
                    </button>
                </div>
                <div>
                    <table className="table general" style={{textAlign:'center'}}>
                        <thead className="thead-dark">
                            <tr>
                                <th style={{color:'rgb(0,255,127)'}}>Name</th>
                                <th style={{color:'rgb(0,255,127)'}}>Money<b className="JKC">(JKC)</b></th>
                                <th style={{color:'rgb(0,255,127)'}}>Wallet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getUsersList()}
                        </tbody>
                    </table>
                    <br></br>
                    <br></br>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className="text-center">
                <h1 className="glow">Create user</h1>
                {form}
            </div>
        )
    }
}