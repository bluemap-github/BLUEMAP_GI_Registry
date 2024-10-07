import React, { useState, useEffect } from "react";

function FileInput({ tagName, fileType, setFile, ImageType }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [allowedFormats, setAllowedFormats] = useState([]);
  const [imageType, setImageType] = useState(""); // 파일 확장자를 저장할 상태

  useEffect(() => {
    // fileType에 따라 허용된 파일 형식 설정
    switch (fileType) {
      case "image":
        setAllowedFormats(["image/jpg", "image/jpeg", "image/png", "image/tif", "image/tiff"]);
        break;
      case "svg":
        setAllowedFormats(["image/svg"]);
        break;
      case "xml":
        setAllowedFormats(["application/xml", "text/xml"]);
        break;
      case "font":
        setAllowedFormats(["font/ttf"]);
        break;
      default:
        setAllowedFormats([]);
        break;
    }
  }, [fileType]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && !allowedFormats.includes(file.type)) {
      setError(`허용된 파일 형식은 ${fileType} 입니다.`);
      setImage(null);
      setPreview("");
      setImageType(""); // 오류 발생 시 확장자 초기화
      return;
    }

    // 파일 확장자 추출 및 정규화
    let extension = file.name.split('.').pop().toLowerCase();
    if (extension === "jpeg") extension = "jpg"; // jpeg를 jpg로 통일
    if (extension === "tiff") extension = "tif"; // tiff를 tif로 통일
    setImageType(extension); // 정규화된 확장자 설정

    setImage(file);
    setError(""); // 오류 메시지 초기화

    if (file && !['tif'].includes(extension)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // TIFF 파일일 경우 미리보기 생략
      setPreview(null);
    }

    setFile(file); // 부모 컴포넌트에 파일 설정
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image) {
      console.log("파일 업로드:", image);
      console.log("정규화된 파일 확장자:", imageType); // 파일 확장자 출력
      ImageType(imageType); // 파일 확장자를 부모 컴포넌트로 전달
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
            accept={allowedFormats.map(format => `.${format.split("/")[1]}`).join(", ")}
            onChange={handleImageChange}
          />
          {error && <p className="text-danger">{error}</p>}
          {
            fileType === "image" && 
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
          }
        </div>
      </div>
    </div>
  );
}

export default FileInput;
