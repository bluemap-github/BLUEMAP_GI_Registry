import React, { useState, useEffect } from 'react';

const PaletteItemInput = ({ onFormSubmit, apiType }) => {
  useEffect(() => {
    setFormData({
      transparency: '70%',
      xmlID: '',
      description: [{ text: '', language: '' }],
      colourValue: {
        sRGB: null, // 시작할 때는 null
        cie: null   // 시작할 때는 null
      }
    });
  }, [apiType]);

  const [formData, setFormData] = useState({
    transparency: '70%',
    xmlID: '',
    description: [{ text: '', language: '' }],
    colourValue: {
      sRGB: null, // 시작할 때는 null
      cie: null   // 시작할 때는 null
    }
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    const keys = name.split('.');  // Handle nested fields like "colourValue.sRGB.red"
    
    if (keys.length === 1) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [keys[0]]: value,
      }));
    } else if (keys.length === 3) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        colourValue: {
          ...prevFormData.colourValue,
          [keys[1]]: {
            ...prevFormData.colourValue[keys[1]],
            [keys[2]]: value,
          },
        },
      }));
    }

    onFormSubmit({
      ...formData,
      [keys[0]]: keys.length === 1 ? value : {
        ...formData.colourValue,
        [keys[1]]: {
          ...formData.colourValue[keys[1]],
          [keys[2]]: value,
        },
      },
    });
  };

  const handleDescriptionChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDescription = [...formData.description];
    updatedDescription[index] = {
      ...updatedDescription[index],
      [name]: value,
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: updatedDescription,
    }));
    onFormSubmit({ ...formData, description: updatedDescription });
  };

  const addSRGB = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      colourValue: {
        ...prevFormData.colourValue,
        sRGB: { red: '', green: '', blue: '' } // 기본값 설정
      }
    }));
  };

  const removeSRGB = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      colourValue: {
        ...prevFormData.colourValue,
        sRGB: null // 값 제거
      }
    }));
  };

  const addCIE = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      colourValue: {
        ...prevFormData.colourValue,
        cie: { x: '', y: '', L: '' } // 기본값 설정
      }
    }));
  };

  const removeCIE = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      colourValue: {
        ...prevFormData.colourValue,
        cie: null // 값 제거
      }
    }));
  };

  return (
    <div style={{ backgroundColor: '#F8F8F8' }} className='p-3 mt-4'>
      <h3>Palette Item Input</h3>

      {/* Transparency */}
      <div className='input-group input-group-sm mt-2'>
        <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>* Transparency</span>
        <input 
          type="text" 
          className="form-control" 
          name="transparency" 
          value={formData.transparency} 
          onChange={handleChange} 
        />
      </div>

      {/* XML ID */}
      <div className='input-group input-group-sm mt-2'>
        <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>* XML ID</span>
        <input 
          type="text" 
          className="form-control" 
          name="xmlID" 
          placeholder="Enter XML ID" 
          value={formData.xmlID} 
          onChange={handleChange} 
        />
      </div>

      {/* sRGB Input */}
      <h5 className="mt-3">sRGB Colour</h5>
      {formData.colourValue.sRGB ? (
        <>
          <div className='input-group input-group-sm mt-2'>
            <span className="input-group-text" style={{ width: '20%' }}>Red</span>
            <input 
              type="text" 
              className="form-control" 
              name="colourValue.sRGB.red" 
              value={formData.colourValue.sRGB.red} 
              onChange={handleChange} 
            />
          </div>
          <div className='input-group input-group-sm mt-2'>
            <span className="input-group-text" style={{ width: '20%' }}>Green</span>
            <input 
              type="text" 
              className="form-control" 
              name="colourValue.sRGB.green" 
              value={formData.colourValue.sRGB.green} 
              onChange={handleChange} 
            />
          </div>
          <div className='input-group input-group-sm mt-2'>
            <span className="input-group-text" style={{ width: '20%' }}>Blue</span>
            <input 
              type="text" 
              className="form-control" 
              name="colourValue.sRGB.blue" 
              value={formData.colourValue.sRGB.blue} 
              onChange={handleChange} 
            />
          </div>
          <button className="btn btn-danger mt-2" onClick={removeSRGB}>Delete sRGB</button>
        </>
      ) : (
        <button className="btn btn-primary mt-2" onClick={addSRGB}>Add sRGB</button>
      )}

      {/* CIE Input */}
      <h5 className="mt-3">CIE Colour</h5>
      {formData.colourValue.cie ? (
        <>
          <div className='input-group input-group-sm mt-2'>
            <span className="input-group-text" style={{ width: '20%' }}>X</span>
            <input 
              type="text" 
              className="form-control" 
              name="colourValue.cie.x" 
              value={formData.colourValue.cie.x} 
              onChange={handleChange} 
            />
          </div>
          <div className='input-group input-group-sm mt-2'>
            <span className="input-group-text" style={{ width: '20%' }}>Y</span>
            <input 
              type="text" 
              className="form-control" 
              name="colourValue.cie.y" 
              value={formData.colourValue.cie.y} 
              onChange={handleChange} 
            />
          </div>
          <div className='input-group input-group-sm mt-2'>
            <span className="input-group-text" style={{ width: '20%' }}>L</span>
            <input 
              type="text" 
              className="form-control" 
              name="colourValue.cie.L" 
              value={formData.colourValue.cie.L} 
              onChange={handleChange} 
            />
          </div>
          <button className="btn btn-danger mt-2" onClick={removeCIE}>Delete CIE</button>
        </>
      ) : (
        <button className="btn btn-primary mt-2" onClick={addCIE}>Add CIE</button>
      )}

      {/* Dynamic Description */}
      <div className='mt-3'>
        <h5>Description(s)</h5>
        {formData.description.map((desc, index) => (
          <div key={index} className='input-group input-group-sm mt-2'>
            <input 
              type="text" 
              className="form-control" 
              name="text" 
              placeholder="Description text" 
              value={desc.text} 
              onChange={(e) => handleDescriptionChange(index, e)} 
            />
            <input 
              type="text" 
              className="form-control" 
              name="language" 
              placeholder="Language" 
              value={desc.language} 
              onChange={(e) => handleDescriptionChange(index, e)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaletteItemInput;
