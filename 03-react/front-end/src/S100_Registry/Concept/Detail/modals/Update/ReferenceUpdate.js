import React, {useState}from "react";
import axios from 'axios';
import { PUT_R_URL } from '../../../api';


function ReferenceUpdate({ itemList, onClose, followIdx }) {
    const str = JSON.stringify(itemList.references[followIdx]);
    const [R, setR] = useState(JSON.parse(str)); // JSON 문자열을 파싱하여 객체로 변환

    const RChange = (event) => {
        // R의 해당 속성을 업데이트
        setR({
            ...R,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmitItem = async () => {
        try {
            const RId = itemList.references[followIdx].id;
            await axios.put(PUT_R_URL(RId), R);
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
            <div>
                <h3 className='mb-2'>Update reference</h3>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>*referenceIdentifier</span>
                    <input
                        value={R.referenceIdentifier} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="referenceIdentifier"
                        name="referenceIdentifier"
                        onChange={RChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='input-group input-group-sm mt-2'>
                    <span className="input-group-text" id="basic-addon1" style={{ width: "40%" }}>*sourceDocument</span>
                    <input
                        value={R.sourceDocument} // 객체의 해당 속성에 접근
                        type="text"
                        className="form-control"
                        placeholder="sourceDocument"
                        name="sourceDocument"
                        onChange={RChange} // 변경 핸들러 설정
                    />
                </div>
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>update</button>
                </div>
            </div>
        </div>
    );
}

export default ReferenceUpdate;