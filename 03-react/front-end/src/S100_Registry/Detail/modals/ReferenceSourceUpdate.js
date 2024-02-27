import React, {useState} from "react";

function ReferenceSourceUpdte({referenceSources, onClose}){
    const [RS, setRS] = useState('');
    
    const RChange = (event) => {
        setRS(event.target.value)
    }

    return (
        <div>
            <textarea
                className='mt-3'
                style={{
                    width: "100%",
                    height: "18rem",
                }}
                value={RS}
                onChange={(event) => RChange(event)}
            ></textarea>
            <button onClick={onClose}>Close</button>
        </div>
    )
}

export default ReferenceSourceUpdte;