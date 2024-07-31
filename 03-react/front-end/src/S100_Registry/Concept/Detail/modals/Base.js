import React from 'react';
import ItemUpdate from './Update/ItemUpdate';
import ManagementInfoUpdate from './Update/ManagementInfoUpdate';
import ReferenceSourceUpdate from './Update/ReferenceSourceUpdate';
import ReferenceUpdate from './Update/ReferenceUpdate';
import ManagementInfoAdd from './Add/ManagementInfoAdd';
import ReferenceSourceAdd from './Add/ReferenceSourceAdd';
import ReferenceAdd from './Add/ReferenceAdd';
import Delete from './Delete';

import { DEL_ITEM_URL, DEL_MI_URL, DEL_RS_URL, DEL_R_URL } from '../../api';

const formComponents = {
  1: (props) => <ItemUpdate items={props.itemList.item} onClose={props.onClose} />,
  2: (props) => <ManagementInfoUpdate itemList={props.itemList} followIdx={props.followIdx} {...props} />,
  3: (props) => <ReferenceSourceUpdate referenceSources={props.itemList.reference_sources} {...props} />,
  4: (props) => <ReferenceUpdate itemList={props.itemList} followIdx={props.followIdx} {...props} />,
  5: (props) => <ManagementInfoAdd onClose={props.onClose} />,
  6: (props) => <ReferenceSourceAdd onClose={props.onClose} />,
  7: (props) => <ReferenceAdd onClose={props.onClose} />,
  8: (props) => <Delete selectedForm={DEL_ITEM_URL(props.keyIdx)} keyIdx={props.selectedForm} {...props} />,
  9: (props) => <Delete selectedForm={DEL_MI_URL(props.keyIdx)} keyIdx={props.selectedForm} {...props} />,
  10: (props) => <Delete selectedForm={DEL_RS_URL(props.keyIdx)} keyIdx={props.selectedForm} {...props} />,
  11: (props) => <Delete selectedForm={DEL_R_URL(props.keyIdx)} keyIdx={props.selectedForm} {...props} />,
};

function Base({ itemList, isOpen, onClose, selectedForm, followIdx, keyIdx }) {
  if (!isOpen) {
    return null;
  }

  // const commonProps = { onClose };

  const formComponent = formComponents[selectedForm]
    ? formComponents[selectedForm]({ itemList, followIdx, keyIdx, selectedForm, onClose })
    : null;

  return (
    <div className="modal-style">
      <div className="modal-content-style">
        {formComponent}
      </div>
    </div>
  );
}

export default Base;
