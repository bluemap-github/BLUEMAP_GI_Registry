import React, { useState, useEffect } from 'react';
import Item from './search/Item';

function AddAttributes({ isOpen, onClose, handleRelatedEnumList, relatedEnumList }) {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedValues, setSelectedValues] = useState(relatedEnumList);
    const [filteredList, setFilteredList] = useState([]);
    console.log("!!", selectedValues)

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
    const [itemTypes, setItemTypes] = useState('SimpleAttribute');
    const handleItemTypes = (e) => {    
        setItemTypes(e.target.value);
    }
    const runFilter = () => {
        console.log(itemTypes, searchTerm);
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
                        borderRadius: '8px',
                    }}
                >
                    <div className="text-end" style={{ height: '10%' }}>
                        <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <h3>Submit Related Values</h3>
                        <Item onSearch={getSearchResult} />
                        <div>
                            <label htmlFor="typeSelect"></label>
                            <select id="typeSelect" onChange={handleItemTypes}>
                                <option value="All">All</option>
                                <option value="SimpleAttribute">Simple Attribute</option>
                                <option value="ComplexAttribute">Complex Attribute</option>
                            </select>
                            <input 
                                type="text" 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                placeholder="Search term" 
                            />
                            <button onClick={runFilter}>Search</button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', height: '70%'}}>
                        <div style={{ border: '1px solid gray', width: '50%' }}>
                            <div>
                                <h4>Search Results:</h4>
                                <div>
                                    {filteredList.length === 0 ? (
                                        <p>No results found</p>
                                    ) : (
                                        <ul>
                                            {filteredList.map((result) => (
                                                <li key={result.id}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={checkIsIncluded(selectedValues, result)}
                                                            onChange={() => handleCheckboxChange(result)}
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
                        <div style={{ border: '1px solid gray', width: '50%' }}>
                            <div>
                                <h4>Selected Values:</h4>
                                <ul>
                                    {selectedValues.map((value) => (
                                        <li key={value.id}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedValues.includes(value)}
                                                    onChange={() => handleCheckboxChange(value)}
                                                />
                                                {value.name}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
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
