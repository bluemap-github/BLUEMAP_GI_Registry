import React, { useState } from 'react';

const EVFilter = ({ data }) => {
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
    };

    return (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            {data === "EnumeratedValue" && 
                <div>
                    <input
                        type="text"
                        value={filterValue}
                        onChange={handleFilterChange}
                        placeholder="Enter filter value"
                    />
                    <button>Search</button>
                </div>
            }
            {data === "SimpleAttribute" && 
                <div>
                    input for data 2
                </div>
            }
            {data === "ComplexAttribute" &&
                <div>
                    input for data 3
                </div>
            }
            {data === "Feature" && 
                <div>
                    input for data 4
                </div>
            }
            {data === "Information" && 
                <div>
                    input for data 5
                </div>
            }
        </div>
    );
};

export default EVFilter;