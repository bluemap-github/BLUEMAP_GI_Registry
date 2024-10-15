import React, { useState, useEffect } from 'react';
import Item from './search/Item';

function AddAttributes({ isOpen, onClose, handleRelatedEnumList, relatedEnumList, componentType }) {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedValues, setSelectedValues] = useState(relatedEnumList);
    const [filteredList, setFilteredList] = useState([]);
    

    const getSearchResult = (results) => {
        setSearchResults(results);
        setFilteredList(results);
    };

    const handleCheckboxChange = (result) => {
        setSelectedValues((prevSelectedValues) => {
            if (prevSelectedValues.includes(result)) {
                return prevSelectedValues.filter((value) => value !== result);
            } else {
                return [...prevSelectedValues, result];
            }
        });
    };

    const handleSubmit = () => {
        handleRelatedEnumList(selectedValues);
        onClose();
    };
    
    const [searchTerm, setSearchTerm] = useState('');
    const [itemTypes, setItemTypes] = useState('All');
    const handleItemTypes = (e) => {    
        setItemTypes(e.target.value);
    }
    const runFilter = () => {
        const filtered = searchResults.filter((item) => {
            if (itemTypes === 'All') {
                return item.name.includes(searchTerm);
            }
            return item.name.includes(searchTerm) && item.itemType === itemTypes;
        });
        setFilteredList(filtered);
    }

    const checkIsIncluded = (selectedValues, result) => {
        return selectedValues.some((value) => value._id === result._id);
    };
    if (!isOpen) {
        return null;
    }

    return (
        <div>
            <div
                className="modal"
                style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: '9999',
                }}
            >
                <div
                    className="modal-content"
                    style={{
                        maxWidth: '50rem',
                        height: '40rem',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                    }}
                >
                    <div className="text-end" >
                        <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                    </div>
                    <h3>Submit Related Values</h3>
                    <div style={{ display: 'flex' }}>
                        <Item onSearch={getSearchResult} componentType={componentType} />
                        <div style={{display: 'flex'}}>
                            {(componentType === 'ComplexAttribute') ? (
                                <div className='input-group'  style={{marginRight: '10px'}}>
                                    <label className='input-group-text' htmlFor="typeSelect">Related Value Type</label>
                                    <select className='form-select' id="typeSelect" onChange={handleItemTypes}>
                                        <option value="All">All</option>
                                        <option value="SimpleAttribute">Simple Attribute</option>
                                        <option value="ComplexAttribute">Complex Attribute</option>
                                    </select>
                                </div>
                            ) : (<></>)}
                            <div className="input-group">
                                <input 
                                    className="form-control"
                                    type="text" 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    placeholder="Search term" 
                                />
                                <button className="btn btn-outline-secondary" onClick={runFilter}>Search</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', height: '70%', marginTop: '15px' }}>
                        {/* Search Results Section */}
                        <div style={{ border: '1px solid gray', width: '50%', padding: '15px', borderRadius: '5px', marginRight: '10px'}}>
                            <div>
                                <h4 style={{ borderBottom: '2px solid #757575', paddingBottom: '10px', marginBottom: '15px', color: '#757575' }}>
                                    Search Results
                                </h4>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {filteredList.length === 0 ? (
                                        <p>No results found</p>
                                    ) : (
                                        <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
                                            {filteredList.map((result) => (
                                                <li key={result.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={checkIsIncluded(selectedValues, result)}
                                                            onChange={() => handleCheckboxChange(result)}
                                                            style={{ marginRight: '10px' }}
                                                        />
                                                        {result.name}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Selected Values Section */}
                        <div style={{ border: '1px solid gray', width: '50%', padding: '15px', borderRadius: '5px'}}>
                            <div>
                                <h4 style={{ borderBottom: '2px solid #757575', paddingBottom: '10px', marginBottom: '15px', color: '#757575' }}>
                                    Selected Values
                                </h4>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
                                        {selectedValues.map((value) => (
                                            <li key={value.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                                <label style={{ display: 'flex', alignItems: 'center' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedValues.includes(value)}
                                                        onChange={() => handleCheckboxChange(value)}
                                                        style={{ marginRight: '10px' }}
                                                    />
                                                    {value.name}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-end">
                        <button className="btn btn-sm btn-primary" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddAttributes;
