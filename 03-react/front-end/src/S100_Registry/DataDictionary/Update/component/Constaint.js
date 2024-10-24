import React, { useState, useEffect } from "react";
import axios from "axios";
import { PUT_CONSTRAINT } from "../../api";

const conceptTableFields = [
  { name: 'String Length', key: 'stringLength', inputType: 'text' },
  { name: 'Text Pattern', key: 'textPattern', inputType: 'number' },
  { name: 'AC Range', key: 'ACRange', inputType: 'text' },
  { name: 'Precision', key: 'precision', inputType: 'number' },
];

const Constraint = ({ items, IsOpened, onClose }) => {
  const [constraint, setConstraint] = useState({});

  // Initialize the form with the first item from the items array
  useEffect(() => {
    if (items && items.length > 0) {
      const initialData = items[0];  // assuming we're working with the first object in the array
      setConstraint(initialData);
    }
  }, [items]);

  // Handle input change to update the form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConstraint((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateConst = async () => {
    // 사용자에게 확인 메시지 띄우기
    const userConfirmed = window.confirm('Are you sure you want to update this item?');

    if (userConfirmed) {
        // _id와 attributeId 속성 제거
        const { _id, ...filteredData } = constraint;

        console.log('Sending PUT request with:', filteredData);
        try {
            // axios PUT 요청을 async/await로 처리
            const response = await axios.put(PUT_CONSTRAINT, filteredData, {
                params: {
                    item_id: _id.encrypted_data,
                    item_iv: _id.iv,
                }
            });
            
            alert('Update successful');
            onClose();
            window.location.reload(); // 페이지 새로고침
        } catch (error) {
            console.error('Error updating:', error);
        }
    } else {
        console.log('Update canceled by user.');
    }
};


  if (!IsOpened) {
    return null;
  }

  return (
    <div className="modal-style">
      <div className="modal-content-style" style={{ width: '1000px' }}>
        <div className='text-end'>
          <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
        </div>
        <pre>{JSON.stringify(constraint, null, 2)}</pre> {/* Display current state */}
        <div>
            <h4>Update Constraint</h4>
        </div>
        <div>
            {conceptTableFields.map(({ name, key, inputType = 'text' }) => (
            <div className="input-group input-group-sm mb-1" key={key}>
                <label className="input-group-text" style={{ width: '40%' }}>
                {name}
                </label>
                <input
                type={inputType}
                className="form-control"
                name={key}
                value={constraint[key] || ''}
                onChange={handleChange} // Call the handleChange function when input changes
                />
            </div>
            ))}
        </div>
        <div className='text-end mt-3'>
          <button onClick={updateConst} className="btn btn-secondary" aria-label="Close">Update</button>
        </div>
      </div>
    </div>
  );
};

export default Constraint;
