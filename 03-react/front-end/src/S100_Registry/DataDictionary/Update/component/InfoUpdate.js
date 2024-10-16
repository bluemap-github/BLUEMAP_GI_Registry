import React, { useState } from 'react';

const InfoUpdate = ({ TagItemType, data, onClose }) => {
    return (
        <div>
            {JSON.stringify(data)}
        </div>
    );
}
export default InfoUpdate;