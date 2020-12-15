import React, { useEffect, useState } from 'react'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import Loader from '../Shared/Loading';


const Recap = props =>(
    <div style={{position:'absolute', left:'75rem', top:'15rem', backgroundColor:'black'}}>
        <h4>Difficulty: {props.difficulty}</h4>
        <h4>Total blocks in the chain:{props.chainLength}</h4>
        <h4>Pending TXs: {props.pendingTransactionsLength}</h4>
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
            if(typeof miner.data.name !== 'undefined'){
                setMiner(res.data);
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
        console.log("res.data.pendingTransactions = ",res.data.pendingTransactions);
        setPendingTransactions(res.data.pendingTransactions);
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
        <DropdownButton
            alignRight
            title={
                fromAddress===''?<span>From Address</span>:<span style={{backgroundColor:'red'}}>{fromAddress.slice(1,40)}</span>
            }
            id="dropdown-item-button"
            size="lg"
            onSelect={handleSelectFromAddress}
            >
            {userOptions.map(u =>{
                return <Dropdown.Item eventKey={u.publicKey} style={{backgroundColor:'blue', color:'white', textShadow:'none'}}>{u.name + ' - ' + u.publicKey.slice(1,30) + ' ...'}</Dropdown.Item>
            })}
        </DropdownButton>
        <br></br>
        <DropdownButton
            alignRight
            title={
                toAddress===''?<span>To Address</span>:<span style={{backgroundColor:'red'}}>{toAddress.slice(1,40)}</span>
            }
            id="dropdown-item-button"
            size="lg"
            onSelect={handleSelectToAddress}
            >
            {userOptions.map(u =>{
                return <Dropdown.Item eventKey={u.publicKey} style={{backgroundColor:'blue', color:'white', textShadow:'none'}}>{u.name + ' - ' + u.publicKey.slice(1,30) + ' ...'}</Dropdown.Item>
            })}
        </DropdownButton>
        <br></br>
            <input type="number" value={amount} name={amount} className="formStyle" placeholder="Amount" required onChange={e => onAmountChange(e.target.value)}></input>                    
            <button type="submit" className="formButton">Add</button>
    </form>)


    if(difficulty !== 0 && pendingTransactions.length >= 3){
        return (
            <div>
            <h1 className="glow">Add transaction</h1>
            <div>
            {form}
            </div>
                <div className="general">
                    <Recap difficulty={difficulty} chainLength={chain.length} pendingTransactionsLength={pendingTransactions.length}></Recap>
                    <div style={{position:'absolute', left:'75rem', top:'25rem'}}>
                        <button type="submit" onClick={minePendingTXs} style={{marginTop:'3rem'}} className="btn btn-primary a-btn-slide-text">
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            <span><strong>Mine 4 TXs in a shout(One for the miner)</strong></span>            
                        </button>
                        <br></br>
                        <button type="submit" onClick={()=>{if (window.confirm('Are you sure you wish to delete the blockchain?')) deleteBlockchain()}} style={{marginTop:'3rem', marginBottom:'3rem', backgroundColor:'red', border:'none'}} className="btn btn-primary a-btn-slide-text">
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            <span><strong>Delete all the blockchain</strong></span>            
                        </button>

                    </div>
                </div>
            </div>
        )
    }

    else if(difficulty!==0){
        return (
            <div className="general">
                <h1 className="glow">Add transaction</h1>
                <div>
                {form}
                </div>
                <h4>Total pending TXs: {pendingTransactions.length}</h4>
                <h4>* You need at least 3 TXs to start the mining</h4>
            </div>
        )
    }
    else{
        return (
            <div>
                <h1 className="glow">Add transaction</h1>
                <div>
                    {form}
                </div>
                <h4 className="general" style={{marginLeft:'5rem', fontSize:'2rem'}}>Total pending TXs: {pendingTransactions.length}</h4>
            </div>
        )
    }
}