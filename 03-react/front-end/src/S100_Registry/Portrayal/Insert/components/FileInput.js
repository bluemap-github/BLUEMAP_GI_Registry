import React, { useState, useEffect } from "react";

function FileInput({ tagName, fileType, setFile, ImageType }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [allowedFormats, setAllowedFormats] = useState([]);
  const [allowedExtensions, setAllowedExtensions] = useState([]); // 확장자 기반 추가 검사

  useEffect(() => {
    // fileType에 따라 허용된 파일 형식 및 확장자 설정
    switch (fileType) {
      case "svg":
        setAllowedFormats(["image/svg+xml"]);
        setAllowedExtensions(["svg"]);
        break;
      case "xml":
        setAllowedFormats(["application/xml", "text/xml"]);
        setAllowedExtensions(["xml"]);
        break;
      case "font":
        setAllowedFormats([]);  // MIME 타입 검사 생략
        setAllowedExtensions(["ttf"]);
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

    // MIME 타입 검사 (폰트 파일 제외)
    if (fileType !== "font" && file && !allowedFormats.includes(file.type)) {
      setError(`허용된 파일 형식은 ${fileType} 입니다. 현재 파일 형식: ${file.type}`);
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

    setFile(file); // 부모 컴포넌트에 파일 설정

    // ImageType이 함수로 전달된 경우에만 호출
    if (typeof ImageType === "function") {
      ImageType(extension); // 파일 확장자 전달
    }
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
              className={`form-control ${image ? "is-valid" : "is-invalid"}`}
              accept={fileType === "font" ? ".ttf" : allowedFormats.join(", ")}
              onChange={handleImageChange}
            />
          {error && <p className="text-danger">{error}</p>}
          {/* <p className="mt-2" style={{ fontSize: "14px", color: image ? "green" : "gray" }}>
            {image ? `선택된 파일: ${image.name}` : "파일이 선택되지 않았습니다."}
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default FileInput;
