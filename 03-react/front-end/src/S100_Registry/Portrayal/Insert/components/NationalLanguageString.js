import React, { useEffect, useState } from 'react';

const NationalLanguageStringInput = ({itemType, tagName, onFormSubmit }) => {
    const [stringList, setStringList] = useState([{ text: '', language: '' }]);
    const nationalLanguageString = {
        text: '',
        language: '',
    };

    useEffect(() => {
        setStringList([{ text: '', language: '' }]);
    }, [itemType]);

    const handleNLSChange = (index, event) => {
        const { name, value } = event.target;
        const updatedNAString = [...stringList];
        updatedNAString[index] = {
            ...updatedNAString[index],
            [name]: value,
        };
        setStringList(updatedNAString);
        onFormSubmit(updatedNAString)
    };

    const addNLS = () => {
        setStringList([...stringList, nationalLanguageString]);
        onFormSubmit([...stringList, nationalLanguageString])
    };

    const removeNLS = (index) => {
        const updatedNAString = stringList.filter((_, i) => i !== index);
        setStringList(updatedNAString);
        onFormSubmit(updatedNAString)
    };
    return (
        <div style={{ backgroundColor: 'white', padding: '10px', paddingTop: '5px'}} className='mb-4'>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', marginTop: '8px'}}>
                <h5>{tagName}</h5>
                <button className='btn btn-outline-secondary btn-sm' onClick={() => addNLS()} style={{ display: 'flex', alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                    </svg>
                    <div style={{ marginLeft: '8px' }}>
                        {`Add ${tagName}`}
                    </div>
                </button>
            </div>
            {stringList.map((desc, index) => (
                <div key={index} className="input-group input-group-sm mb-2">
                    <input
                        type="text"
                        className="form-control"
                        name="text"
                        placeholder={`${tagName} Text`}
                        value={desc.text}
                        onChange={(e) => handleNLSChange(index, e)}
                    />
                    <input
                        type="text"
                        className="form-control"
                        name="language"
                        placeholder="Language"
                        value={desc.language}
                        onChange={(e) => handleNLSChange(index, e)}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeNLS(index)}
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NationalLanguageStringInput;
