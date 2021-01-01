import axios from 'axios';
import {React,useState,useEffect} from 'react'
import Loader from '../Shared/Loading';


export default function Miner() {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [money, setMoney] = useState(0);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(async()=>{
        axios.get('http://localhost:4000/miner')
                .then(res=>{
                    if(typeof res.data.publicKey !== 'undefined'){
                        setPublicKey(res.data.publicKey);
                        setPrivateKey(res.data.privateKey);
                        setName(res.data.name);
                        setMoney(res.data.money);
                    }
                    setLoading(false);
                })
    },[])

    
    function onNameChange(name){
        setName(name);
    }

    function onMoneyChange(money){
        setMoney(money);
    }

    async function deleteMiner(e){
        await axios.delete('http://localhost:4000/miner')
            .then(res=>{
                setPublicKey('');
            })
    }

    async function onSubmit(e){
        await e.preventDefault();
        const data = {name,money};
        await axios.post('http://localhost:4000/miner',data)
            .then(res=>{
                setPublicKey(res.data.publicKey);
                setPrivateKey(res.data.privateKey);
                setMoney(res.data.money);
                setName(res.data.name);
            })
            .catch(err=>console.error(err))
    }

    if(loading){
        return (
            <Loader flag={false}></Loader>
        )
    }


    if(publicKey === ''){
        return (
            <div>
                <h1 className="glow">Create Miner</h1>
                <div>
                    <form onSubmit={onSubmit}>
                        <input type="text" name={name} className="formStyle" placeholder="Name" required minLength="2" maxLength="30" onChange={e => onNameChange(e.target.value)}/>
                        <input type="number" style={{width:'10rem'}} name={money} className="formStyle" placeholder="Amount" minLength="1" maxLength="12" required minLength='1' maxLength='12' onChange={e =>onMoneyChange(e.target.value)}/>
                        <br></br>
                        <button type="submit" className="formButton">Create</button>
                    </form>
                </div>
            </div>
        )            
    }
    else{
        return (
            <div>
                <h2 className="text-center glow">Hello {name}</h2>
                <hr />
                <div className="general" style={{fontSize:'2rem', marginLeft:'5rem'}}>
                    <div className="form-group">
                        <label for="Money" className="control-label col-sm-3">Money:</label>
                        <div className="form-control-static col-sm-7">
                            <label>{money}</label>
                            <label className="JKC">JKC</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="publicKey" className="control-label col-sm-3">Public Key:</label>
                        <div className="form-control-static col-sm-3" style={{fontSize:'1rem'}}>
                            <label>0x{publicKey}</label>
                        </div>
                    </div>
                    <button type="button" onClick={()=>{if (window.confirm('Are you sure you wish to delete the miner?')) deleteMiner()}} className="btn btn-danger delete-btn">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        <span><strong>Delete Miner</strong></span>            
                    </button>
                </div>      
            </div>
        )
    }
}