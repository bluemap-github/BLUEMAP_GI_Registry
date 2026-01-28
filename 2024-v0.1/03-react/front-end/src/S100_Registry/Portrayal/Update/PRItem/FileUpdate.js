import React, { useState } from 'react';

const FileUpdate = ({ fileTag, data, onFormSubmit }) => {
    const [file, setFile] = useState(null);  // 파일 상태 추가

    // fileTag에 따라 업로드된 파일이 있는지 여부를 확인 (Font는 fontFile, Schema는 xmlSchema, SVG는 itemDetail)
    const isFileUploaded = fileTag === "Font"
        ? !!data.fontFile
        : fileTag === "Schema"
        ? !!data.xmlSchema
        : !!data.itemDetail;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            onFormSubmit(selectedFile);  // 선택된 파일 상태에 저장
            setFile(selectedFile);  // 파일 상태 업데이트
        }
    };

    // fileTag에 따라 허용할 파일 형식 설정
    const acceptedFileTypes = fileTag === "Font" 
        ? ".ttf" 
        : fileTag === "Schema" 
        ? ".xml" 
        : fileTag === "SVG" 
        ? ".svg" 
        : "";

    return (
        <div>
            <div className='mt-4'>
                <h5>{fileTag} File</h5>
                {isFileUploaded && (
                    <div className="input-group input-group-sm mb-2">
                        <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>
                            현재 업로드 된 파일
                        </span>
                        <input
                            type="text"
                            className='form-control'
                            value={file ? file.name : (fileTag === "Font" ? data.fontFile : fileTag === "Schema" ? data.xmlSchema : data.itemDetail)}  // 선택된 파일명 표시 또는 기존 파일명 표시
                            disabled
                        />
                    </div>
                )}
                <div className="input-group input-group-sm mb-2">
                    <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>
                        파일 추가 혹은 수정
                    </span>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}  // 파일 선택 처리
                        accept={acceptedFileTypes}  // 파일 형식 설정
                    />
                </div>
                <div className="input-group input-group-sm mb-2">
                    <span className="input-group-text" style={{ width: '50%', fontWeight: 'bold' }}>
                        {fileTag} Type
                    </span>
                    <input type="text" className='form-control' value={fileTag === "Font" ? "ttf" : fileTag === "Schema" ? "xml" : "svg"} disabled />
                </div>
            </div>
        </div>
    );
};

export default FileUpdate;
