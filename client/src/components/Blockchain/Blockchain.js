import React, { useEffect, useState } from 'react'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import Loader from '../Shared/Loading';
import './Blockchain.css'
import {Link} from 'react-router-dom';


const Recap = props =>(
    <div style={{position:'absolute', left:'15rem', top:'45rem', backgroundColor:'black'}}>
        <h3>Difficulty: {props.difficulty}</h3>
        <h3>Total blocks in the chain: {props.chainLength}</h3>
        <h3>Pending TXs: {props.pendingTransactionsLength}</h3>
    </div>
)



export default function Blockchain() {
    //default values such as [],0, {} and '' are assigned
    const [chain, setChain] = useState([]);
    const [difficulty, setDifficulty] = useState(0);
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [miningReward, setMiningReward] = useState(100);
    const [fromAddress, setFromAddress] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [miner, setMiner] = useState({});
    const [userOptions, setUserOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    //flag is used to differentiate between Component loading & mining time
    const [flag, setFlag] = useState(false);
    useEffect(async() => {
        const res = await axios.get('http://localhost:4000/blockchain')
        //else - no blockchain created yet
        if(typeof res.data.difficulty !== 'undefined'){
            setChain(res.data.chain);
            setDifficulty(res.data.difficulty);
            setPendingTransactions(res.data.pendingTransactions);
            setMiningReward(res.data.miningReward);
            //check out the miner
            //else - no miner created yet
            const miner = await axios.get('http://localhost:4000/miner');
            if(typeof miner.data.noMiner === 'undefined'){
                setMiner(miner.data);
            }
        }
        let users = (await axios.get('http://localhost:4000/users'));
        let usersData = users.data;
        for(let i = 0;i< usersData.length; i++){
            userOptions.push(usersData[i]);
        }
        setLoading(false);
    }, []);


    const onAmountChange = (amount) =>{
        setAmount(amount);
    }

    const onSubmit = async(e)=>{
        if(fromAddress === '' || toAddress === ''){
            alert('You must select From Address & To Address fields !');
        }
        else if(fromAddress === toAddress){
            alert('From address & To address must be different !');
        }
        else{
            await e.preventDefault();
            const data = {
                amount: amount,
                fromAddress: fromAddress,
                toAddress: toAddress
            }
            //The fields of toAddress & fromAddress have already been validated
            const res = await axios.post('http://localhost:4000/blockchain',data);

            if(typeof res.data.error === 'undefined'){
                setChain(res.data.chain);
                setDifficulty(res.data.difficulty);
                setPendingTransactions(res.data.pendingTransactions);
                setMiningReward(res.data.miningReward);
                setFromAddress('');
                setToAddress('');
                setAmount('');    
            }
            //There is no enough money ...
            else{
                alert(`${fromAddress.slice(1,30)} ...\n has no enough money to commit this tx`);
            }
            
        }
    }

    const deleteBlockchain = async(e)=>{
        await axios.delete('http://localhost:4000/blockchain')
        setChain([]);
        setDifficulty(0);
        setPendingTransactions([]);
        setMiningReward(100);
        setFromAddress('');
        setToAddress('');
        setAmount('');
    }

    const minePendingTXs = async()=>{
        //displaying some UI in the meantime of mining...
        setFlag(true);
        setLoading(true);
        const res = await axios.post('http://localhost:4000/mineblocks',miner);
        setLoading(false);
        setFlag(false);
        //Here, the mining is completed
        setPendingTransactions(res.data.pendingTransactions);
        setChain(res.data.chain);
    }



    const handleSelectFromAddress=(e)=>{
        setFromAddress(e);
    }

    
    const handleSelectToAddress=(e)=>{
        setToAddress(e);
    }

    if(loading){
        return (
            <Loader flag={flag}></Loader>
        )
    }


    let form = (<form onSubmit={onSubmit} className="general">
        <div style={{ position:'relative', left:'-10rem'}}>
            <DropdownButton
            alignRight
            variant="success"
            className="dropdown-link"
            title={
                fromAddress===''?<span className="dropdown-title">From Address</span>:<span style={{backgroundColor:'grey', color:'black'}}>0x{fromAddress.slice(1,40)}</span>
            }
            id="dropdown-item-button"
            size="lg"
            onSelect={handleSelectFromAddress}
            >
            {userOptions.map(u =>{
                return <Dropdown.Item eventKey={u.publicKey} style={{backgroundColor:'blue', color:'white', textShadow:'none'}}>{u.name + ' - 0x' + u.publicKey.slice(1,30) + ' ...'}</Dropdown.Item>
            })}
            </DropdownButton>
        </div>
        <div style={{position:'relative', right:'-10rem'}}>
            <DropdownButton
                className="dropdown-link"
                variant="success"
                title={
                    toAddress===''?<span className="dropdown-title">To Address</span>:<span style={{backgroundColor:'grey', color:'black'}}>0x{toAddress.slice(1,40)}</span>
                }
                id="dropdown-item-button"
                size="lg"
                onSelect={handleSelectToAddress}
                >
                {userOptions.map(u =>{
                    return <Dropdown.Item eventKey={u.publicKey} style={{backgroundColor:'blue', color:'white', textShadow:'none'}}>{u.name + ' - 0x' + u.publicKey.slice(1,30) + ' ...'}</Dropdown.Item>
                })}
            </DropdownButton>
        </div>
        <br></br>
            <input type="number" value={amount} name={amount} className="formStyle" placeholder="Amount" required onChange={e => onAmountChange(e.target.value)}></input>                    
            <button type="submit" className="formButton btn">Add</button>
    </form>)


    let deleteButton = (<button type="submit" 
            onClick={()=>{
            if (window.confirm('Are you sure you wish to delete the blockchain?')) deleteBlockchain()}}
            style={{position:'absolute', top:'55rem',left:'100rem', color:'black',height:'3rem',fontSize:'1.4rem', border:'none'}}
            className="btn btn-danger a-btn-slide-text">
            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
            <span><strong>Delete all the blockchain</strong></span>            
            </button>);

    if(difficulty !== 0 && pendingTransactions.length >= 3){
        if(typeof miner.name !== 'undefined')
        {
            return (
                <div className="text-center">
                    <h1 className="glow">Add transaction</h1>
                    <div>{form}</div>
                    <div className="general">
                        <Recap difficulty={difficulty} chainLength={chain.length} pendingTransactionsLength={pendingTransactions.length}></Recap>
                            <button type="submit" onClick={minePendingTXs} style={{position:'absolute', top:'45rem',left:'50rem',color:'black', height:'8rem', fontSize:'1.8rem'}} className="btn btn-primary a-btn-slide-text">
                                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                <span><strong>Mine 4 TXs in a shout (One for the miner)</strong></span>            
                            </button>
                            <br></br>
                            {deleteButton}
                    </div>
                </div>
            )
        }
        else{
            return (
                <div className="text-center">
                    <h1 className="glow">Add transaction</h1>
                    <div>{form}</div>
                    <div className="general">
                        <Recap difficulty={difficulty} chainLength={chain.length} pendingTransactionsLength={pendingTransactions.length}></Recap>
                            <Link to="/miner">Click here to create a miner</Link>
                            <br></br>
                            {deleteButton}
                    </div>
                </div>
            )
        }
    }

    else if(difficulty!==0){
        return (
            <div className="general text-center">
                <h1 className="glow">Add transaction</h1>
                <div>{form}</div>
                <div style={{position:'relative', right:'20rem'}}>
                    <h4>Total pending TXs: {pendingTransactions.length}</h4>
                    <h4>Total blocks in the chain: {chain.length} </h4>
                    <h4>* You need at least 3 TXs to start the mining</h4>
                </div>
                <button type="submit" 
                    onClick={()=>{
                    if (window.confirm('Are you sure you wish to delete the blockchain?')) deleteBlockchain()}}
                    style={{position:'relative',left:'20rem', color:'black',height:'3rem',fontSize:'1.4rem', border:'none'}}
                    className="btn btn-danger a-btn-slide-text">
                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    <span><strong>Delete all the blockchain</strong></span>            
                </button>
            </div>
        )
    }
    else{
        return (
            <div className="text-center">
                <h1 className="glow">Add transaction</h1>
                <div>
                    {form}
                </div>
                <h4 className="general" style={{marginLeft:'5rem', fontSize:'2rem'}}>Total pending TXs: {pendingTransactions.length}</h4>
            </div>
        )
    }
}


/**<button type="submit" 
            onClick={()=>{
            if (window.confirm('Are you sure you wish to delete the blockchain?')) deleteBlockchain()}}
            style={{position:'absolute', top:'55rem',left:'100rem', color:'black',height:'3rem',fontSize:'1.4rem', border:'none'}}
            className="btn btn-danger a-btn-slide-text">
            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
            <span><strong>Delete all the blockchain</strong></span>            
            </button> */