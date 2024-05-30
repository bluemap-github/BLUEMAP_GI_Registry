import React, { useState } from 'react';

const EVFilter = ({ data }) => {
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
    };

    return (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            
            
            {data === 1 && 
                <div>
                    input for data 1
                    <input
                        type="text"
                        value={filterValue}
                        onChange={handleFilterChange}
                        placeholder="Enter filter value"
                    />
                    <button>Search</button>
                </div>
            }
            {data === 2 && 
                <div>
                    input for data 2
                </div>
            }
            {data === 3 &&
                <div>
                    input for data 3
                </div>
            }
            {data === 4 && 
                <div>
                    input for data 4
                </div>
            }
            {data === 5 && 
                <div>
                    input for data 5
                </div>
            }
        </div>
    );
};

export default EVFilter;