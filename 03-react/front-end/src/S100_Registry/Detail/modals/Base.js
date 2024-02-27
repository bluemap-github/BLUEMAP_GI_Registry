import React from 'react';
import ItemUpdate from './ItemUpdate';
import ManagementInfoUpdate from './ManagementInfoUpdate';
import ReferenceSourceUpdate from './ReferenceSourceUpdate';
import ReferenceUpdate from './ReferenceUpdate';


function Base({ itemList, isOpen, onClose, selectedForm  }) {
  if (!isOpen) {
    return null;
  }

  let formComponent;
  switch (selectedForm) {
    case 1:
      formComponent = <ItemUpdate items={itemList.item} onClose={onClose}/>;
      break;
    case 2:
      formComponent = <ManagementInfoUpdate managementInfos={itemList.management_infos} onClose={onClose}/>;
      break;

    case 3:
      formComponent = <ReferenceSourceUpdate referenceSources={itemList.reference_sources} onClose={onClose}/>;
      break;
    case 4:
      formComponent = <ReferenceUpdate references={itemList.references} onClose={onClose}/>;
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
