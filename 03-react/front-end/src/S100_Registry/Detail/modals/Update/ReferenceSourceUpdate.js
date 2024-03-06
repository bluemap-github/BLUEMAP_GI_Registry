import React, { useState } from "react";
import axios from "axios";

const putRSUrl = (RSId) => {
    return `https://hjk0815.pythonanywhere.com/api/v1/registerItem/referenceSource/${RSId}/put/`;
};

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
            const RSId = RS.id;
            const RSResponse = await axios.put(putRSUrl(RSId), RS);
            console.log('Item data successfully put:', RSResponse.data);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <div>
            <div className='text-end mb-3'>
                <button onClick={onClose} type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <div>
                <div className='input-group '>
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
                <div className='input-group '>
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
                <div className='input-group '>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>similarity</span>
                    <input
                        value={RS.similarity} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="similarity"
                        name="similarity"
                        onChange={RChange} // 변경 핸들러 설정
                    />
                </div>
                <button onClick={handleSubmitItem}>update</button>
            </div>
        </div>
    );
}

export default ReferenceSourceUpdate;
