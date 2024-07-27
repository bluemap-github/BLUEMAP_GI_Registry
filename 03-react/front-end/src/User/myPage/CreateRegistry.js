import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { POST_REGISTRY } from '../api';

const CreateRegistry = () => {
    const navigate = useNavigate();
    const [validation, setValidation] = useState('숫자, 영문 소문자, 하이픈(-)만 입력 가능합니다.');
    const [formData, setFormData] = useState({
        name: '',
        operatingLanguage: 'Choose',
        contentSummary: '',
        uniformResourceIdentifier: '',
        dateOfLastChange: '2024-01-01',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };
        setFormData(updatedFormData);

        if (name === 'uniformResourceIdentifier') {
            validateURI(value);
        }
    }

    const validateURI = (value) => {
        const uriPattern = /^[a-z0-9-]+$/;
        if (value.length >= 4 && uriPattern.test(value)) {
            setValidation('유효한 URI입니다.');
            setErrors(prevErrors => ({ ...prevErrors, uniformResourceIdentifier: '' }));
        } else if (value.length < 4) {
            setValidation('URI는 4글자 이상이어야 합니다.');
            setErrors(prevErrors => ({ ...prevErrors, uniformResourceIdentifier: 'URI는 4글자 이상이어야 합니다.' }));
        } else {
            setValidation('숫자, 영문 소문자, 하이픈(-)만 입력 가능합니다.');
            setErrors(prevErrors => ({ ...prevErrors, uniformResourceIdentifier: '숫자, 영문 소문자, 하이픈(-)만 입력 가능합니다.' }));
        }
    }

    const postRegistry = (e) => {
        e.preventDefault();
        const newErrors = {};

        // 모든 필드가 채워져 있는지 확인
        if (!formData.name) newErrors.name = '레지스트리 이름을 입력해주세요.';
        if (!formData.uniformResourceIdentifier) newErrors.uniformResourceIdentifier = '레지스트리 주소를 입력해주세요.';
        if (formData.operatingLanguage === 'Choose') newErrors.operatingLanguage = '운영 언어를 선택해주세요.';
        if (!formData.contentSummary) newErrors.contentSummary = '설명을 입력해주세요.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const token = localStorage.getItem('jwt'); // 저장된 JWT 토큰 가져오기

        axios.post(POST_REGISTRY, formData, {
            headers: {
                'Authorization': `Bearer ${token}` // Authorization 헤더에 토큰 추가
            }
        })
            .then(response => {
                console.log(response);
                navigate('/');
            })
            .catch(error => {
                console.error(error);
                navigate('/error');
            });
    };

    return (
        <div className="container p-5">
            <h4 style={{ fontWeight: 'bold' }}>새 레지스트리 만들기</h4>
            <div style={{ backgroundColor: '#F8F8F8' }} className='p-5 mt-4'>
                <form onSubmit={postRegistry}>
                    <div className="mb-3">
                        <label htmlFor="registryName" className="form-label">레지스트리 이름</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="registry name"
                            name="name"
                            onChange={handleChange}
                        />
                        {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="uniformResourceIdentifier" className="form-label">레지스트리 주소</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="URI"
                                name="uniformResourceIdentifier"
                                onChange={handleChange}
                                style={{ width: '95%' }}
                            />
                            <span>.registry</span>
                        </div>
                        <label style={{ color: 'gray', fontSize: '12px' }}>
                            {validation}
                        </label>
                        {errors.uniformResourceIdentifier && <div style={{ color: 'red', fontSize: '12px' }}>{errors.uniformResourceIdentifier}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="operatingLanguage" className="form-label">운영언어</label>
                        <select
                            id="operatingLanguage"
                            name="operatingLanguage"
                            className="form-select"
                            value={formData.operatingLanguage}
                            onChange={handleChange}>
                            <option value="Choose">Choose</option>
                            <option value="한국어">한국어</option>
                            <option value="English">English</option>
                        </select>
                        {errors.operatingLanguage && <span style={{ color: 'red', fontSize: '12px' }}>{errors.operatingLanguage}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">설명</label>
                        <textarea
                            className="form-control"
                            id="description"
                            rows="3"
                            placeholder="summary of Registry"
                            name="contentSummary"
                            onChange={handleChange}>
                        </textarea>
                        {errors.contentSummary && <span style={{ color: 'red', fontSize: '12px' }}>{errors.contentSummary}</span>}
                    </div>
                    <div className='text-end'>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRegistry;
