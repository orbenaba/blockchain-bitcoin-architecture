import React, { useEffect, useState } from 'react'
import DropdownList from 'react-widgets/lib/DropdownList'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'









export default function Blockchain() {
    //default values such as [],0, {} and '' are assigned
    const [chain, setChain] = useState([]);
    const [difficulty, setDifficulty] = useState(0);
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [miningReward, setMiningReward] = useState(100);
    const [fromAddress, setFromAddress] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [miner, setMiner] = useState({});
    const [userOptions, setUserOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fromName, setFromName] = useState('');

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
            //  userOptions.push(<option key={i}>{users[i]}</option>)
            userOptions.push(usersData[i]);
        }
        setLoading(false);
    }, []);
    const onFromAddressChange = (fromAddress) =>{
        setFromAddress(fromAddress);
    }

    const onToAddressChange = (toAddress) =>{
        setToAddress(toAddress);
    }

    const onAmountChange = (amount) =>{
        setAmount(amount);
    }

    const onSubmit = async(e)=>{
        await e.preventDefault();
        const data = {
            amount: amount,
            fromAddress: fromAddress,
            toAddress: toAddress
        }
        //The fields of toAddress & fromAddress have already been validated
        const res = await axios.post('http://localhost:4000/blockchain',data);
        setChain(res.data.chain);
        setDifficulty(res.data.difficulty);
        setPendingTransactions(res.data.pendingTransactions);
        setMiningReward(res.data.miningReward);
    }

    const deleteBlockchain = async(e)=>{
        await axios.delete('http://localhost:4000/blockchain')
        setChain([]);
        setDifficulty(0);
        setPendingTransactions([]);
        setMiningReward(100);
        setFromAddress('');
        setToAddress('');
        setAmount(0);               
    }

    const minePendingTXs = async()=>{
        axios.post('http://localhost:4000/mineblocks',miner)
            .then(res=>{
                
            })
    }



    if(loading){
        return <h1 style={{color:'white'}}>L0@d1ng ....</h1>;
    }

    const handleSelectFromAddress=(e)=>{
        setFromAddress(e);
    }

    
    const handleSelectToAddress=(e)=>{
        setToAddress(e);
    }

    let form = (<form onSubmit={onSubmit}>
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
                return <Dropdown.Item eventKey={u.publicKey}>{u.name + ' - ' + u.publicKey.slice(1,30) + ' ...'}</Dropdown.Item>
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
                return <Dropdown.Item eventKey={u.publicKey}>{u.name + ' - ' + u.publicKey.slice(1,30) + ' ...'}</Dropdown.Item>
            })}
        </DropdownButton>
        <br></br>
            <label style={{marginRight:'6rem'}}>Amount:</label>
            <input type="number" name={amount} className="formStyle" placeholder="Amount" required onChange={e => onAmountChange(e.target.value)}></input>                    
            <button type="submit" className="formButton">Add</button>
    </form>)




    if(difficulty !== 0 && pendingTransactions.length >= 3){
        return (
            <div>
            <h1 className="glow">Add transaction</h1>
            <div>
            {form}
            </div>
                <div>
                    <h4>difficulty: {difficulty}</h4>
                    <h4>Total blocks in the chain:{chain.length}</h4>
                    <h4>Pending TXs: {pendingTransactions.length}</h4>
                    <button type="submit" onClick={deleteBlockchain} className="btn btn-primary a-btn-slide-text">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        <span><strong>Delete all the blockchain</strong></span>            
                    </button>

                    <button type="submit" onClick={minePendingTXs} className="btn btn-primary a-btn-slide-text">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        <span><strong>Mine 4 TXs in a shout(One for the miner)</strong></span>            
                    </button>
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