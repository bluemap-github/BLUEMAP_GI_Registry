import React, { useState } from 'react';
import Item from './search/Item';

const AddAssociatedAttributes = ({isOpen, onClose, handleRelatedValueList}) => {
    const [data, setData] = useState([]);
    const [selectedObj, setSelectedObj] = useState(null);
    const [selectedID, setSelectedID] = useState(null);

    

    const handleSetData = (data) => {
        setData(data);
    };

    const handleChange = (e, item) => {
        if (e.target.checked) {
            setSelectedObj(item);
            setSelectedID(item._id);
        } else {
            setSelectedObj(null);
            setSelectedID(null);
        }
    };

    const handleSubmit = () => {
        handleRelatedValueList(selectedObj, selectedID);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-style">
            <div className="modal-content-style">
                <div className='text-end' style={{height: "10%"}}>
                    <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                </div>
            <div>
            <Item onSearch={handleSetData} />
            <div>
                {data.length === 0 ? (<p>no data</p>) : (
                    <>
                    {
                        data.simple_attributes.map((item, index) => (
                            <div key={index}>
                                <input 
                                    type="checkbox" 
                                    value={item._id} 
                                    checked={selectedID === item._id}
                                    onChange={(e) => handleChange(e, item)} 
                                />
                                <label>{item.name}</label>
                            </div>
                        ))
                    }
                    </>
                )}
            </div>
            <div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
      </div>
    </div>
    );
};

export default AddAssociatedAttributes;
