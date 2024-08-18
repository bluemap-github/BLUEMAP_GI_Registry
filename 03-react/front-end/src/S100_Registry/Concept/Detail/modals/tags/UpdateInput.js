import React, {forwardRef} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UpdateInput = ({ItemChange = "", itemValue, name, spanName, type, isDate = false}) => {
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <div onClick={onClick} ref={ref}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-fill" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5"/>
            </svg>
        </div>
    ));

    return (
        <div className='input-group input-group-sm mt-2'>
            <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>{spanName}</span>
            { isDate ? (
            <div className="form-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <input
                    type={type}
                    value={itemValue}
                    className="date-input"
                    placeholder={name}
                    name={name}
                    onChange={ItemChange} 
                />
                <DatePicker 
                    name={name} 
                    selected={itemValue} 
                    onChange={(date) => {
                        ItemChange({ target: { name: name, value: formatDate(date) } });
                    }} 
                    customInput={<ExampleCustomInput />}
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