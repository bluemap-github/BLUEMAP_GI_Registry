import React, { useState } from "react";
import axios from "axios";
import {PUT_RS_URL} from "../../../api"

function ReferenceSourceUpdate({ referenceSources, onClose }) {
    const [RS, setRS] = useState(referenceSources[0]);

    const RChange = (event) => {
        const { name, value } = event.target;
        setRS(prevRS => ({
            ...prevRS,
            [name]: value
        }));
    };

    const handleSubmitItem = async () => {
        try {
            const RSId = RS._id;
            const RSResponse = await axios.put(PUT_RS_URL(RSId), RS);
            console.log('Item data successfully put:', RSResponse.data);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <div>
            <div className='text-end'>
                <button onClick={onClose} type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <h3 className='mb-2'>Update reference Source</h3>
            <div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>referenceIdentifier</span>
                    <input
                        value={RS.referenceIdentifier} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="referenceIdentifier"
                        name="referenceIdentifier"
                        onChange={RChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>sourceDocument</span>
                    <input
                        value={RS.sourceDocument} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="sourceDocument"
                        name="sourceDocument"
                        onChange={RChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <label class="input-group-text" for="similarity" style={{ width: "40%", fontWeight: "bold" }}>*similarity</label>
                    <select class="form-select" id="similarity" name="similarity" onChange={RChange} >
                        <option selected>{RS.similarity}</option>
                        <option value="identical">identical</option>
                        <option value="restyled">restyled</option>
                        <option value="contextAdded">contextAdded</option>
                        <option value="generalization">generalization</option>
                        <option value="specialization">specialization</option>
                        <option value="unspecified">unspecified</option>
                    </select>
                </div>
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>update</button>
                </div>
            </div>
        </div>
    );
}

export default ReferenceSourceUpdate;
