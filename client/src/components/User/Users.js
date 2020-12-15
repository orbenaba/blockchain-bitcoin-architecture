import {React, useEffect, useState} from 'react'
import axios from 'axios';

const User = props =>(
    <tr>
       <td>{props.userParam.name}</td>
       <td style={{color:'rgb(172, 224, 0)'}}>{props.userParam.money}</td>
       <td style={{color:'yellow'}}>{props.userParam.publicKey}</td>
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
        const res = await axios.get('http://localhost:4000/users')
        setOldUsers(res.data);
        setLoading(false);
    })


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
                console.log(res)
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
                    <form onSubmit={onSubmit} >
                        <input type="text" name={name} className="formStyle" placeholder="Name" required onChange={e => onNameChange(e.target.value)}/>
                        <input type="number" style={{width:'10rem'}} name={money} className="formStyle" placeholder="Amount" required onChange={e => onMoneyChange(e.target.value)}/>
                        <br></br>
                        <button type="submit" className="formButton">Create</button>
                    </form>
                </div>)
    

    if(loading){
        return <h1 style={{color:'white'}}>L0@d1ng ....</h1>;
    }

    if(oldUsers.length !== 0){
        return (           
            <div>
                <h1 className="glow">users</h1>
                {form}
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
                            {getUsersList()}
                        </tbody>
                    </table>
                </div>
                <div>
                    <button type="submit" onClick={()=>{if (window.confirm('Are you sure you wish to delete all the users?')) deleteAll()}} className="formButton">Delete all users</button>
                </div>
            </div>
        )
    }
    else{
        return(
            <div>
                <h1 className="glow">Create user</h1>
                {form}
            </div>
        )
    }
}