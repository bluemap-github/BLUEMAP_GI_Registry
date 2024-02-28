import React from 'react';
import ItemUpdate from './Update/ItemUpdate';
import ManagementInfoUpdate from './Update/ManagementInfoUpdate';
import ReferenceSourceUpdate from './Update/ReferenceSourceUpdate';
import ReferenceUpdate from './Update/ReferenceUpdate';
import ManagementInfoAdd from './Add/ManagementInfoAdd';
import ReferenceSourceAdd from './Add/ReferenceSourceAdd';
import ReferenceAdd from './Add/ReferenceAdd';
import Delete from './Delete';

const delItemUrl = (idx) => {
  return `http://127.0.0.1:8000/api/v1/registerItem/${idx}/delete/`;
};

const delMIUrl = (idx) => {
  return `http://127.0.0.1:8000/api/v1/registerItem/managementInfo/${idx}/delete/`;
};

const delRSUrl = (idx) => {
  return `http://127.0.0.1:8000/api/v1/registerItem/referenceSource/${idx}/delete/`;
};

const delRUrl = (idx) => {
  return `http://127.0.0.1:8000/api/v1/registerItem/reference/${idx}/delete/`;
};
function Base({ itemList, isOpen, onClose, selectedForm, followIdx, keyIdx}) {
  if (!isOpen) {
    return null;
  }
  let formComponent;
  switch (selectedForm) {
    case 1:
      formComponent = <ItemUpdate items={itemList.item} onClose={onClose}/>;
      break;
    case 2:
      formComponent = <ManagementInfoUpdate itemList={itemList} onClose={onClose} followIdx={followIdx}/>;
      break;
    case 3:
      formComponent = <ReferenceSourceUpdate referenceSources={itemList.reference_sources} onClose={onClose}/>;
      break;
    case 4:
      formComponent = <ReferenceUpdate itemList={itemList} onClose={onClose} followIdx={followIdx}/>;
      break;
    case 5:
      formComponent = <ManagementInfoAdd onClose={onClose} itemId={itemList.item.id}/>;
      break;
    case 6:
      formComponent = <ReferenceSourceAdd onClose={onClose} itemId={itemList.item.id}/>;
      break;
    case 7:
      formComponent = <ReferenceAdd onClose={onClose} itemId={itemList.item.id}/>;
      break;
    case 8: // del item 
      formComponent = <Delete onClose={onClose} selectedForm={delItemUrl(keyIdx)} keyIdx={selectedForm} />;
      break;
    case 9: // del MI
      formComponent = <Delete onClose={onClose} selectedForm={delMIUrl(keyIdx)} keyIdx={selectedForm} />;
      break;
    case 10:// del RS
      formComponent = <Delete onClose={onClose} selectedForm={delRSUrl(keyIdx)} keyIdx={selectedForm} />;
      break;
    case 11:// del R
      formComponent = <Delete onClose={onClose} selectedForm={delRUrl(keyIdx)} keyIdx={selectedForm} />;
      break;
    default:
      formComponent = null;
  }

  return (
    <div 
      className="modal"
      style={{
        position: "fixed", /* 화면에 고정 */
        top: "0", /* 화면 상단에 배치 */
        left: "0", /* 화면 왼쪽에 배치 */
        width: "100%", /* 전체 화면 너비 */
        height: "100%", /* 전체 화면 높이 */
        backgroundColor: "rgba(0, 0, 0, 0.5)", /* 배경 색상 및 투명도 설정 */
        display: "flex", /* 내부 요소를 수평 정렬하기 위해 */
        justifyContent: "center", /* 내부 요소를 수평 가운데 정렬하기 위해 */
        alignItems: "center", /* 내부 요소를 수직 가운데 정렬하기 위해 */
        zIndex : "9999" /* 다른 요소 위에 위치하도록 설정 */
      }}
    >
      <div 
        className="modal-content"
        style={{
          maxWidth: "30rem",
          backgroundColor: "white", /* 모달 내용 배경 색상 */
          padding: "20px", /* 내용 패딩 설정 */
          borderRadius: "8px", /* 내용 모서리를 둥글게 만듭니다 */
        }}
      >
        {formComponent}
      </div>
    </div>
  );
}

export default Base;
