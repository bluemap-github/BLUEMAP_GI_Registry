import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getDecryptedItem, setEncryptedItem } from "../../cryptoComponent/storageUtils";

const buttonTypes = [
    { type: 'EnumeratedValue', label: 'Enumerated Values' },
    { type: 'SimpleAttribute', label: 'Simple Attributes' },
    { type: 'ComplexAttribute', label: 'Complex Attributes' },
    { type: 'FeatureType', label: 'Features' },
    { type: 'InformationType', label: 'Informations' }
];

const DDRChoose = ({ clickHandler, viewType }) => {
    // 현재 viewType에 해당하는 label 찾기
    const navigate = useNavigate();
    const selectedLabel = buttonTypes.find((btn) => btn.type === viewType)?.label || '';
    const handleMovePage = () => {
        navigate(`/${getDecryptedItem('REGISTRY_URI')}/create`, {
            state: {
              createViewType: viewType,
            }
          });
    };
    return (
        <>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div className="btn-group btn-group-toggle">
                    {buttonTypes.map((btn) => (
                        <button
                            key={btn.type}
                            className={`btn btn-outline-secondary ${viewType === btn.type ? 'active' : ''}`}
                            onClick={() => clickHandler(btn.type)}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
                <div>
                    <button className='btn btn-outline-primary' onClick={handleMovePage}> + Create {selectedLabel}</button>
                </div>
            </div>
        </>
    );
};

export default DDRChoose;
