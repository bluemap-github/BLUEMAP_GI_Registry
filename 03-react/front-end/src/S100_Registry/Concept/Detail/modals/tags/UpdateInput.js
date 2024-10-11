import React from 'react';

const UpdateInput = ({ItemChange = "", itemValue, name, spanName, type, isDate = false}) => {

    return (
        <div className='input-group input-group-sm mt-2'>
            <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>{spanName}</span>
            { isDate ? (
            <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <input
                    type="date"  // input 타입을 date로 설정
                    value={itemValue}
                    className="date-input"
                    placeholder={name}
                    name={name}
                    onChange={ItemChange} 
                />
            </div>
        ) : (
            <input
                type={type}
                value={itemValue}
                className="form-control"
                placeholder={name}
                name={name}
                onChange={ItemChange} 
            />
        )}
        </div>
    );
};

export default UpdateInput;
