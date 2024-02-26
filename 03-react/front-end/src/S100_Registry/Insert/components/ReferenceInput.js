import React from 'react';

function ReferenceInput({references, RChange, popRInput}) {

    return (
        <div>
            <h3 className='mt-3'>Reference</h3>
            {references.map((reference, index) => (
                <div key={index}>
                    <textarea
                        className='mt-3'
                        style={{
                            width: "100%",
                            height: "18rem",
                        }}
                        value={reference}
                        onChange={(event) => RChange(event, index)}
                        placeholder={`R 쓰는 곳${index}`}
                    ></textarea>
                    <button onClick={() => popRInput(index)}>Remove R</button>
                </div>
            ))}
        </div>
    )
}

export default ReferenceInput;