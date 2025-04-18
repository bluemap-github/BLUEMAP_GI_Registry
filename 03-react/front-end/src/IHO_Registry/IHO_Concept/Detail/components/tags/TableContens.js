import React from 'react';

const TableContents = ({name, itemValue}) => {
    return (
        <tr>
            <th className='text-center' scope="row" style={{width: '25%'}}>{name}</th>
            <td>{itemValue}</td>
        </tr>
    );
};

export default TableContents;