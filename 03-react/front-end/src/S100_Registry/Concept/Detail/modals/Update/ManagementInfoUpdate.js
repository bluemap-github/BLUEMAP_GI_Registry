import React, { useState, useEffect, forwardRef } from "react";
import axios from 'axios';
import { PUT_MI_URL  } from '../../../api';
import UpdateInput from "../tags/UpdateInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ManagementInfoUpdate({ itemList, onClose, followIdx }) {
    const initialMI = itemList.management_infos[followIdx];
    const [MI, setMI] = useState(initialMI);

    useEffect(() => {
        setMI(initialMI); // props로 받은 initialMI를 초기 상태로 설정
    }, [initialMI]);

    const MIChange = (event) => {
        const { name, value } = event.target;
        setMI(prevMI => ({
            ...prevMI,
            [name]: value
        }));
    };

    const handleSubmitItem = async () => {
        try {
            const MIId = itemList.management_infos[followIdx]._id.encrypted_data;
            const item_iv = itemList.management_infos[followIdx]._id.iv;
            await axios.put(PUT_MI_URL, MI, {
                params: {
                    item_id: MIId,
                    item_iv: item_iv
                }
            });
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <div onClick={onClick} ref={ref}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-fill" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5"/>
            </svg>
        </div>
    ));

    const fields = [
        { type: "text", name: 'submittingOrganisation', spanName: '*Submitting Organisation' },
        { type: "text", name: 'proposedChange', spanName: '*Proposed Change' },
        { type: "date", name: 'dateAccepted', spanName: 'Accepted Date', isDate: true },
        { type: "date", name: 'dateProposed', spanName: '*Proposed Date', isDate: true },
        { type: "date", name: 'dateAmended', spanName: 'Amended Date', isDate: true },
        { type: "text", name: 'controlBodyNotes', spanName: 'Control Body Notes' }
    ];

    const proposalTypes = ["addition", "clarification", "supersession", "retirement"];
    const proposalStatuses = [
        "notYetDetermined", "transferred", "accepted", "rejected", 
        "withdrawn", "negotiation", "appeal", "appealTransferred", 
        "appealAccepted", "appealRejected"
    ];

    return (
        <div>
            <div className='text-end'>
                <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
            </div>
            <div>
                <h3 className='mb-2'>Update Management Info</h3>
                <div className='input-group input-group-sm mt-2'>
                    <label style={{ width: "40%", fontWeight: "bold" }} className="input-group-text" htmlFor="proposalType">*Proposal Type</label>
                    <select className="form-select" id="proposalType" name="proposalType" onChange={MIChange} value={MI.proposalType}>
                        {proposalTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                {fields.map((field, index) => (
                    <UpdateInput
                        key={index}
                        type={field.type}
                        ItemChange={MIChange}
                        itemValue={MI[field.name]}
                        name={field.name}
                        spanName={field.spanName}
                        isDate={field.isDate}
                    />
                ))}
                <div className='input-group input-group-sm mt-2'>
                    <label style={{ width: "40%", fontWeight: "bold" }} className="input-group-text" htmlFor="proposalStatus">*Proposal Status</label>
                    <select className="form-select" id="proposalStatus" name="proposalStatus" onChange={MIChange} value={MI.proposalStatus}>
                        {proposalStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div className='text-end'>
                    <button className='btn btn-secondary btn-sm mt-3' onClick={handleSubmitItem}>Update</button>
                </div>
            </div>
        </div>
    );
}

export default ManagementInfoUpdate;
