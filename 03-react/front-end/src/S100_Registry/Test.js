import React, {useState} from "react";
import {MONGO_DB_TEST} from './api';
import axios from 'axios';

const Test = () => {
    const [formData, setFormData] = useState(
        {
            "code":"1116",
            "grade":"sophomore"
        }
    );
    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };
        setFormData(updatedFormData);
    }
    const capture = async ()=> {
        try {
            const testRes = await axios.post(MONGO_DB_TEST, formData)
            console.log('Item data successfully posted:', testRes.data);
        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            <input 
                onChange={handleChange} 
            ></input>
            <button onClick={capture}>submit</button>
        </div>
    );
};

export default Test;
