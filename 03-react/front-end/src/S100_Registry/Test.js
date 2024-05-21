import React, { useEffect, useState } from "react";
import { MONGO_DB_POST, MONGO_DB_GET_ALL } from './Concept/api';
import axios from 'axios';

const Test = () => {
    const [itemList, setItemList] = useState([]);
    const [formData, setFormData] = useState({
        "code": "",
        "grade": "",
        "name": "",
        "classroom_id" : "",
    });
    const [submissionStatus, setSubmissionStatus] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };
        setFormData(updatedFormData);
    }

    const capture = async () => {
        try {
            const testRes = await axios.post(MONGO_DB_POST, formData);
            console.log('Item data successfully posted:', testRes.data);
            setSubmissionStatus('success');
            setFormData({
                "code": "",
                "grade": "",
                "name": "",
                "classroom_id" : "",
            });
        } catch (err) {
            console.log(err);
            setSubmissionStatus('error');
        }
    }

    useEffect(() => {
        const fetchItemList = async () => {
            try {
                const response = await axios.get(MONGO_DB_GET_ALL);
                console.log(response.data)
                setItemList(response.data)
            } catch (error) {
                console.error('Error fetching item list:', error);
            }
        };
    
        fetchItemList();
    }, []); 
    
    return (
        <div>
            <input 
                name="code" 
                value={formData.code} 
                onChange={handleChange} 
                placeholder="Enter code"
            />
            <input 
                name="grade" 
                value={formData.grade} 
                onChange={handleChange} 
                placeholder="Enter grade"
            />
            <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter name"
            />
            <input 
                name="classroom_id" 
                value={formData.classroom_id} 
                onChange={handleChange} 
                placeholder="Enter classroomId"
            />
            <button onClick={capture}>Submit</button>
            <div style={{ backgroundColor: "#F2FBEF" }}>
                <h3>List</h3>
                <div>
                    {itemList.map((item, index) => (
                        <p key={item.id}>[{item.code}] {item.name} ({item.grade})</p> // 예시로 item.code와 item.name 출력
                    ))}
                </div>
            </div>
            {submissionStatus === 'success' && <p>Submission successful!</p>}
            {submissionStatus === 'error' && <p>Submission failed. Please try again.</p>}
        </div>
    );    
};

export default Test;
