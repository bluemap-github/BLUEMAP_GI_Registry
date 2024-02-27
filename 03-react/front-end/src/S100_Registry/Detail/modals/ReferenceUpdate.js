import React, {useState}from "react";

function ReferenceUpdate({references, onClose}){
    const [R, setR] = useState('');

    const RChange = (event) => {
        setR(event.target.value)
    }

    return (
        <div>
            <textarea
                className='mt-3'
                style={{
                    width: "100%",
                    height: "18rem",
                }}
                value={R}
                onChange={(event) => RChange(event)}
            ></textarea>
            <button onClick={onClose}>Close</button>
        </div>
    )
}
export default ReferenceUpdate;