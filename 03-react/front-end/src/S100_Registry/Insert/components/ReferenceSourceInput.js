import React from 'react';

function ReferenceSourceInput({referenceSources, RSChange, popRSInput}) {

    return (
        <div>
            <h3 className='mt-3'>Reference Sources</h3>
            {referenceSources.map((referenceSource, index) => (
                <div key={index}>
                    <textarea 
                        className='mt-3'
                        style={{ 
                            width: "100%",
                            height: "18rem",
                        }}
                        value={referenceSource}
                        onChange={(event) => RSChange(event, index)}
                        placeholder={`RS 쓰는 곳${index}`}
                    ></textarea>
                    <button onClick={() => popRSInput(index)}>Remove RS</button>
                </div>
            ))}
        </div>
    )
}

export default ReferenceSourceInput;