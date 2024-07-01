import React, {useState }from 'react';
import axios from 'axios';


function Test() {
    const [testdata , setTestdata] = useState({
        "name": "tester1",
        "operatingLanguage": "KOR",
        "contentSummary": "summerry",
        "uniformResourceIdentifier": "sdf",
        "dateOfLastChange": "2024-06-04"
    });
    const handleSubmit = () => {
        axios.post('http://127.0.0.1:8000/api/v1/concept_register/post/', testdata)
        .then(response => {
            console.log(response.data._id);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }
    return (
        <div>
            user name: <input type="text" value={testdata.name} onChange={(e) => setTestdata({...testdata, name: e.target.value})} />  <br />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default Test;