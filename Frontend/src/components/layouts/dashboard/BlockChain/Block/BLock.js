import React, {useState, Fragment} from 'react';


export default function BLock() {
    const [block, setBlock] =  useState({
        // transactions: [],
        // signature:""

        number: 0

    })

    const clickMe = () => {
        let current =  block.number;
        current ++ ;
        setBlock({...setBlock, number: current});
    }


    
    return (
        <Fragment>
           <button onClick= { (e) => setBlock(...setBlock,) } >Add 1 to counter</button>
           <h1> The number is : { block.number}</h1>
           
            
        </Fragment>
    )
}

