import React, { useState, useEffect } from "react";

function ImageInput({ tagName, fileType, setImageType }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [allowedFormats, setAllowedFormats] = useState([]);
  const [allowedExtensions, setAllowedExtensions] = useState([]); // 확장자 기반 추가 검사

  useEffect(() => {
    // fileType에 따라 허용된 파일 형식 및 확장자 설정
    switch (fileType) {
      case "image":
        setAllowedFormats(["image/jpg", "image/jpeg", "image/png", "image/tif", "image/tiff"]);
        setAllowedExtensions(["jpg", "jpeg", "png", "tif", "tiff"]);
        break;
      default:
        setAllowedFormats([]);
        setAllowedExtensions([]);
        break;
    }
  }, [fileType]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 확장자 검사
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      setError(`허용된 파일 확장자는 ${allowedExtensions.join(', ')}입니다. 현재 파일 확장자: .${extension}`);
      setImage(null);
      setPreview("");
      return;
    }

    setImage(file);
    setError(""); // 오류 메시지 초기화

    if (fileType === "image" && !['tif'].includes(extension)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // TIFF 파일일 경우 미리보기 생략
      setPreview(null);
    }

    let finalImageType;

    // 확장자에 따른 타입 변환
    if (extension === "jpg" || extension === "jpeg") {
      finalImageType = "jpg";
    } else if (extension === "tif" || extension === "tiff") {
      finalImageType = "tif";
    } else {
      finalImageType = extension; // png 등 그대로 유지
    }

    setImageType(file, finalImageType); // 부모 컴포넌트에 파일 설정

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image) {
      console.log("파일 업로드:", image);
    }
  };

  return (
    <div className="file-input-container" style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <div onChange={handleSubmit}>
        <div style={{ backgroundColor: 'white', padding: '10px', paddingTop: '5px' }} className="mb-4">
          <div style={{fontSize: '20px'}} className="mb-2">{tagName}</div>
          <input
              type="file"
              className="form-control"
              accept={fileType === "font" ? "" : allowedFormats.join(", ")} // 폰트일 경우 accept 비움
              onChange={handleImageChange}
            />
          {error && <p className="text-danger">{error}</p>}
          <>
              {preview ? (
                <div className="preview-container" style={{width: '100%', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <img
                    src={preview}
                    alt="미리보기"
                    className="img-thumbnail"
                    style={{ height: '100%', objectFit: 'contain' }} // 이미지가 세로 크기에 맞추어지고 비율을 유지
                  />
                </div>
              ): (
                <div style={{width: '100%', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <span style={{ color: 'gray', fontSize: '16px' }}>미리보기 없음</span>
                </div>
              )}
            </>
        </div>
      </div>
    </div>
  );
}

export default ImageInput;
