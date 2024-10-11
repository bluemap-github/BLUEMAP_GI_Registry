import React from 'react';

const PRAssoUpdateModal = ({IsOpened, onClose, data}) => {
    if (!IsOpened) {
        return null;
    }
    return (
        <div className="modal-style">
            <div className="modal-content-style">
                <div className='text-end'>
                    <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
                </div>
                <div>
                    여기에 이제 asso 들어간다고 
                </div>
            </div>
        </div>
    );
};

export default PRAssoUpdateModal;