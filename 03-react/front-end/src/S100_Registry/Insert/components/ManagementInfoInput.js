import React from 'react';

function ManagementInfoInput({managementInfos, MIChange, popMIInput }) {

    return (
        <div>
            <h3 className='mt-3'>Management Informations</h3>
            {managementInfos.map((managementInfo, index) => (
                <div key={index}>
                    <textarea 
                        className='mt-3'
                        style={{ 
                            width: "100%",
                            height: "18rem",
                        }}
                        value={managementInfo}
                        onChange={(event) => MIChange(event, index)}
                        placeholder={`MI 쓰는 곳${index}`}
                    ></textarea>
                    <button onClick={() => popMIInput(index)}>Remove</button>
                </div>
            ))}
        </div>
    )
}

export default ManagementInfoInput;