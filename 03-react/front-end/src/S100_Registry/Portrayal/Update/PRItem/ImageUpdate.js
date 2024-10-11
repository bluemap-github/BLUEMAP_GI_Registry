import React, { useState } from 'react';

const ImageUpdate = ({ data, onFormSubmit }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [engineeringImage, setEngineeringImage] = useState(null);
    const [previewType, setPreviewType] = useState(data.previewType);
    const [engineeringType, setEngineeringType] = useState(data.engineeringImageType);
    const [isPreviewUploaded, setIsPreviewUploaded] = useState(!!data.previewImage);
    const [isEngineeringUploaded, setIsEngineeringUploaded] = useState(!!data.engineeringImage);

    const getFileType = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'jpg' || ext === 'jpeg') return 'jpg';
        if (ext === 'png') return 'png';
        if (ext === 'tiff' || ext === 'tif') return 'tif';
        return ext;
    };

    const handlePreviewFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setPreviewImage(selectedFile);
            const fileType = getFileType(selectedFile.name);
            setPreviewType(fileType);
            setIsPreviewUploaded(true);
            onFormSubmit("previewImage", selectedFile, "previewType", fileType)
        }
    };

    const handleEngineeringFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setEngineeringImage(selectedFile);
            const fileType = getFileType(selectedFile.name);
            setEngineeringType(fileType);
            setIsEngineeringUploaded(true);
            onFormSubmit("engineeringImage", selectedFile, "engineeringImageType", fileType)
        }
    };

    return (
        <div>
            <div className='mt-4'>
                <h5>Preview Image</h5>
                {isPreviewUploaded && (
                    <div className="input-group input-group-sm mb-2">
                        <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>
                            현재 업로드 된 파일
                        </span>
                        <input
                            type="text"
                            className='form-control'
                            value={previewImage ? previewImage.name : data.previewImage}
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
                        onChange={handlePreviewFileChange}
                        accept=".jpg,.jpeg,.png,.tif,.tiff"
                    />
                </div>
                <div className="input-group input-group-sm mb-2">
                    <span className="input-group-text" style={{ width: '50%', fontWeight: 'bold' }}>
                        Preview Image Type
                    </span>
                    <input type="text" className='form-control' value={previewType} disabled />
                </div>
            </div>

            <div className='mt-4'>
                <h5>Engineering Image</h5>
                {isEngineeringUploaded && (
                    <div className="input-group input-group-sm mb-2">
                        <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>
                            현재 업로드 된 파일
                        </span>
                        <input
                            type="text"
                            className='form-control'
                            value={engineeringImage ? engineeringImage.name : data.engineeringImage}
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
                        onChange={handleEngineeringFileChange}
                        accept=".jpg,.jpeg,.png,.tif,.tiff"
                    />
                </div>
                <div className="input-group input-group-sm mb-2">
                    <span className="input-group-text" style={{ width: '50%', fontWeight: 'bold' }}>
                        Engineering Image Type
                    </span>
                    <input type="text" className='form-control' value={engineeringType} disabled />
                </div>
            </div>
        </div>
    );
};

export default ImageUpdate;
