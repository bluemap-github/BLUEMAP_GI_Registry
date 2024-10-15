import React, { useEffect, useState } from 'react';
import FileInput from './FileInput';
import NationalLangueString from './NationalLanguageString';
import {basicJSONs} from './basicJSONs';
import BooleanTag from './BooleanTag';
import AlertInfoTags from './AlertInfoTags';
import RGBandCIE from './RGBandCIE';
import ImageInput from './ImageInput';

const DynamicItemForm = ({ itemType, onFormSubmit }) => {
  const baseInformationFields = {
    description: [{ text: '', language: '' }],
    colourValue: { sRGB: { red: '', green: '', blue: '' }, cie: { x: '', y: '', L: '' } },
    text: [{ text: '', language: '' }],
    alertPriority: { priority: '', default: '', optional: '' }, 
    alertInfo: { priority: { priority: '', default: '', optional: '' } }, // alertPriority를 직접 설정
    routeMonitor: { priority: { priority: '', default: '', optional: '' } }, // alertInfo를 직접 설정
    routePlan: { priority: { priority: '', default: '', optional: '' } }, // alertInfo를 직접 설정
    style: ''
  };

  const [formData, setFormData] = useState(basicJSONs[itemType]);

  useEffect(() => {
    setFormData(basicJSONs[itemType]);
    onFormSubmit(basicJSONs[itemType]);
  }, [itemType]);
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    const keys = name.split('.'); // Handle nested keys like colourValue.sRGB.red

    if (keys.length === 3) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [keys[0]]: {
          ...prevFormData[keys[0]],
          [keys[1]]: {
            ...prevFormData[keys[0]][keys[1]],
            [keys[2]]: value,
          },
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    onFormSubmit({
      ...formData,
      [name]: value,
    });
  };

  const commonFields = [
    { name: 'XML ID', key: 'xmlID', inputType: 'text' },
    { name: 'Descriptions', key: 'description', isDescription: true },
  ];

  const visualItemFields = [
    { name: 'Item Detail (svg) Upload', key: 'itemDetail', fileType: 'svg' },
    { name: 'Preview Image', key: 'previewImage', fileType: 'image' },
    { name: 'Engineering Image', key: 'engineeringImage', fileType: 'image' },
  ];

  const specificFields = {
    'Symbol': visualItemFields,
    'LineStyle': visualItemFields,
    'AreaFill': visualItemFields,
    'Pixmap': visualItemFields,
    'SymbolSchema': [
        { name: 'XML Schema', key: 'xmlSchema', fileType: 'xml' },
    ],
    'LineStyleSchema': [
        { name: 'XML Schema', key: 'xmlSchema', fileType: 'xml' },
    ],
    'AreaFillSchema': [
        { name: 'XML Schema', key: 'xmlSchema', fileType: 'xml' },
    ],
    'PixmapSchema': [
        { name: 'XML Schema', key: 'xmlSchema', fileType: 'xml' },
    ],
    'ColourProfileSchema': [
        { name: 'XML Schema', key: 'xmlSchema', fileType: 'xml' },
    ],
    'ColourToken': [
        { name: 'Token', key: 'token', inputType: 'text'  },
    ],
    'PaletteItem': [],
    'DisplayPlane': [
        { name: 'Order', key: 'order', inputType: 'number' }
    ],
    'ViewingGroup': [],
    'Font': [
        { name: 'Font File Upload', key: 'fontFile', fileType: 'font' }
    ],
    'ContextParameter': [
        { name: 'Default Value', key: 'defaultValue', inputType: 'text' }
    ],
    'DrawingPriority': [
        { name: 'Priority', key: 'priority', inputType: 'number' }
    ],
    'Alert' : [],
    'AlertHighlight': [],
    'AlertMessage': []
  };

  const getTableFields = (itemType) => [
    ...commonFields,
    ...(specificFields[itemType] || []),
  ];

  const fields = getTableFields(itemType);

  // 이미지 입력란이 필요한 itemType 목록
  const imageItemTypes = ['Symbol', 'LineStyle', 'AreaFill', 'Pixmap'];
  const NLS = ['AlertMessage']
  const Enums = {
    'AlertHighlight': {'style': ['AlamHighlight', 'CautionHighlight']},
    // 'AlertPriority': ['alam', 'warning', 'caution', 'indication'],
    'ContextParameter': {'parameterType': ['boolean', 'integer', 'double', 'string', 'date']},
  }
  const Booleans = {
    'AlertHighlight': 'optional', 
    'ViewingGroup': 'foundationMode',
  }
  const onFileChange = (key, file) => {
    const updatedFormData = { ...formData, [key]: file };
    setFormData(updatedFormData);
    onFormSubmit(updatedFormData); // 부모로 전달
  };

  const onImageTypeChange = (key, imageType, key2, imageType2) => {
    const updatedFormData = { ...formData, [key]: imageType , [key2]: imageType2};
    setFormData(updatedFormData);
    onFormSubmit(updatedFormData); // Pass updated data to parent
  };

  const onNLSChange = (key, addNLS) => {
    const updatedFormData = { ...formData, [key]: addNLS };
    setFormData(updatedFormData);
    onFormSubmit(updatedFormData); // 부모로 전달
  }

  const onBooleanChange = (key, boolOption) => {
    const updatedFormData = { ...formData, [key]: boolOption };
    setFormData(updatedFormData);
    onFormSubmit(updatedFormData); // Pass updated data to parent
  };

  const onAlertinfoChange = (key, alertInfo) => {
    const updatedFormData = { ...formData, [key]: alertInfo };
    setFormData(updatedFormData);
    onFormSubmit(updatedFormData); // Pass updated data to parent
  };

  const viewFormData = () => {
    console.log(formData);
  };
  const onRGBandCIEChange = (transparency, addPIValue) => {
    const updatedFormData = { ...formData, transparency: transparency, colourValue: addPIValue };
    setFormData(updatedFormData);
    onFormSubmit(updatedFormData);
  }

  

  return (
    <div className="item-input-form-bg p-3 pb-1 mt-4">
      <h3>{itemType}</h3>
      {fields.length > 0 ? (
        fields.map(({ name, key, isDescription, fileType, inputType }) => (
          <div key={key}>
            {key === "previewImage" || key === "engineeringImage" ? null : (
              fileType ? (
                <div>
                  <FileInput 
                    tagName={name} 
                    fileType={fileType} 
                    // setFile={(file) => setFormData((prevFormData) => ({ ...prevFormData, [key]: file }))} 
                    setFile={(file) => onFileChange(key, file)} 
                  />
                </div>
              ) : isDescription ? (
                <NationalLangueString itemType={itemType} tagName={"Description"} onFormSubmit={(addNLS) => onNLSChange("description", addNLS)}/>
              ) : (
                <div className="input-group input-group-sm mb-4">
                  <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>
                    {name}
                  </span>
                  <input
                    type={inputType}
                    className="form-control"
                    name={key}
                    placeholder={`Enter ${name}`}
                    value={key.split('.').reduce((acc, part) => acc && acc[part], formData) || ''}
                    onChange={handleChange}
                  />
                </div>
              )
            )}
          </div>
        ))
      ) : (
        <p>No fields available for {itemType}</p>
      )}
      {
        itemType === 'PaletteItem' ? (
          <RGBandCIE onValuesChange={(transparency, addPIValue) => onRGBandCIEChange(transparency, addPIValue)}/>
        ) : null
      }
      {
        itemType === 'Alert' ? (
          <div className='mb-2'>
            <AlertInfoTags tagName={"Route Modnitor"} onFormSubmit={(addMonitor) => onAlertinfoChange("routeMonitor", addMonitor)}/>
            <AlertInfoTags tagName={"Route Plan"} onFormSubmit={(addPlan) => onAlertinfoChange("routePlan", addPlan)}/>
          </div>
        ) : null
      }
      {
        NLS.includes(itemType) ? (<NationalLangueString tagName={"Text"} onFormSubmit={(addNLS) => onNLSChange("text", addNLS)}/>) : null
      }
      { itemType in Booleans ? (
          <BooleanTag
            optionName={Booleans[itemType]}  // Pass the option name
            onFormsubmit={onBooleanChange}  // Directly pass the function
          />
      ) : null }
      {
        itemType in Enums ? (
          <div>
            {Object.keys(Enums[itemType]).map((fieldKey) => (
              <div key={fieldKey} className="input-group input-group-sm mb-4">
                <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>
                  Select {fieldKey}
                </span>
                <select
                  className="form-select"
                  name={fieldKey}
                  value={formData[fieldKey] || ''}  // Set the selected value from formData
                  onChange={handleChange}  // Update formData when the selection changes
                >
                  <option value="" disabled>Select {fieldKey}</option>
                  {Enums[itemType][fieldKey].map((enumValue) => (
                    <option key={enumValue} value={enumValue}>
                      {enumValue}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ) : null
      }
      {/* 이미지 입력란은 itemType이 imageItemTypes에 있을 때만 렌더링 */}
      {imageItemTypes.includes(itemType) && (
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <ImageInput
              tagName={'Preview Image Upload'}
              fileType="image"
              setImageType={(file, imageType) => onImageTypeChange("previewImage", file, "previewType", imageType)}  // Use a different name to clarify usage
            />
          </div>
          <div style={{ flex: 1 }}>
            <ImageInput
              tagName={'Engineering Image Upload'}
              fileType="image"
              setImageType={(file, imageType) => onImageTypeChange("engineeringImage", file, "engineeringImageType", imageType)}  // Same here
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default DynamicItemForm;
