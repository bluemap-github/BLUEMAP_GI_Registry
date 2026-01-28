import React from 'react';

import AddAlias from './AddAlias';
import AddControlBodyNotes from './AddControlBodyNotes';

function Base({ isOpen, onClose, selectedForm, onformdata, aliasData, id, CBNData}) {
  const handleCheck = (newAliasList) => {
      onformdata(newAliasList)
  };
  
  if (!isOpen) {
    return null;
  }
  let formComponent;
  switch (selectedForm) {
    case 1:
      formComponent = <AddAlias onClose={onClose} onAliasSubmit={handleCheck} aliasData={aliasData}/>;
      break;
    case 2:
      formComponent = <AddControlBodyNotes onClose={onClose} onCBNList={handleCheck} id={id} CBNData={CBNData}/>;
      break;
    // case 3:
    //   formComponent = <AddRealtedValues />;
    default:
      formComponent = null;
  }
  
  return (
    <div 
      className="modal-style"
    >
      <div 
        className="modal-content-style"
      >
        <div className='text-end' style={{height: "10%"}}>
            <button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
        </div>
        <div>
          {formComponent}
        </div>
      </div>
    </div>
  );
}

export default Base;
