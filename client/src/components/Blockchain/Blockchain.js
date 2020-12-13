import React, { useEffect, useState } from 'react'
import axios from 'axios';

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
    const {userOptions, setUserOptions} = useState([]);

    useEffect(() => {

        async function fetchData(){
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
                let users = await axios.get('http://localhost:4000/users');
                for(let i = 0;i< users.length; i++){
                    console.log("users[i] = ",users[i]);
                    userOptions.push(<option key={i}>{users[i]}</option>)
                }
            }
        }
        fetchData();
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

    if(difficulty !== 0 && pendingTransactions.length >= 3){
        return (
            <div>
            <h1 className="glow">Add transaction</h1>
            <div>
            <form onSubmit={onSubmit}>
                <input type="text" name={fromAddress} className="formStyle" placeholder="From address - public key" required onChange={e =>onFromAddressChange(e.target.value)}/>
                <input type="text" name={toAddress} className="formStyle" placeholder="To address - public key" required onChange={e =>onToAddressChange(e.target.value)}/>
                <input type="number" name={amount} className="formStyle" placeholder="Amount" required onChange={e => onAmountChange(e.target.value)}></input>
                <button type="submit" className="formButton">Add</button>
            </form>
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
                    <form onSubmit={onSubmit}>
                        <label>From Address:</label>
                        {/*<input type="select" name={fromAddress} className="formStyle" placeholder="From address - public key" required onChange={e => onFromAddressChange(e.target.value)}/>
        */}
                    <select name="fromAddress" style={{width:'10rem'}} value={fromAddress}>
                    {userOptions}
                    </select>             
                        
                        
                        
                        <br></br>

                        <label style={{marginRight:'2.1rem'}}>To Address:</label>
                        <input type="text" name={toAddress} className="formStyle" placeholder="To address - public key" required onChange={e =>onToAddressChange(e.target.value)}/>
                        <br></br>
                        
                        <label style={{marginRight:'6rem'}}>Amount:</label>
                        <input type="number" name={amount} className="formStyle" placeholder="Amount" required onChange={e => onAmountChange(e.target.value)}></input>                    
                        
    
                        
                        <button type="submit" className="formButton">Add</button>
                    </form>
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
                    <form onSubmit={onSubmit}>
                        <label className="general">From Address:</label>
                        <input type="text" name={fromAddress} className="formStyle" placeholder="From address - public key" required onChange={e => onFromAddressChange(e.target.value)}/>
                        <br></br>
                        <label className="general" style={{marginRight:'2.1rem'}}>To Address:</label>
                        <input type="select" name={toAddress} className="formStyle" placeholder="To address - public key" required onChange={e =>onToAddressChange(e.target.value)}/>
                        <br></br>
                        <label className="general" style={{marginRight:'6rem'}}>Amount:</label>
                         {/*<input type="select" name={this.state.amount} className="formStyle" placeholder="Amount" required onChange={e => this.onAmountChange(e.target.value)}></input>
        */}
                         <select name="fromAddress" value={fromAddress}>
                         {/*users.map((e, key) => {
                             return <option key={key} value={e.value}>{e.name}</option>;
                         })*/}
                     </select>
                     
                     
                         <button type="submit" className="formButton">Add</button>
                    </form>
                </div>
                <h4 className="general" style={{marginLeft:'5rem', fontSize:'2rem'}}>Total pending TXs: {pendingTransactions.length}</h4>
            </div>
        )
    }
}