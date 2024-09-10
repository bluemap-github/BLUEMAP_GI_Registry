import React, { useState } from 'react';

const DynamicItemForm = ({ itemType, onFormSubmit }) => {
  const [formData, setFormData] = useState({ 
    description: [{ text: '', language: '' }],
    colourValue: { sRGB: { red: '', green: '', blue: '' }, cie: { x: '', y: '', L: '' } }, // Initialize nested structure
    text: [{ text: '', language: '' }], // For AlertMessage
    routeMonitor: [{ priority: [{ priority: '', default: '', optional: '' }] }],
    routePlan: [{ priority: [{ priority: '', default: '', optional: '' }] }]
  });

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
    onFormSubmit({
      ...formData,
      description: updatedDescription,
    });
  };

  const handleTextChange = (index, event) => {
    const { name, value } = event.target;
    const updatedText = [...formData.text];
    updatedText[index] = {
      ...updatedText[index],
      [name]: value,
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      text: updatedText,
    }));
    onFormSubmit({
      ...formData,
      text: updatedText,
    });
  };

  const handlePriorityChange = (groupType, index, priorityIndex, event) => {
    const { name, value } = event.target;
    const updatedGroup = [...formData[groupType]];
    updatedGroup[index].priority[priorityIndex] = {
      ...updatedGroup[index].priority[priorityIndex],
      [name]: value,
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      [groupType]: updatedGroup,
    }));
    onFormSubmit({
      ...formData,
      [groupType]: updatedGroup,
    });
  };

  const addPriority = (groupType, index) => {
    const updatedGroup = [...formData[groupType]];
    updatedGroup[index].priority.push({ priority: '', default: '', optional: '' });
    setFormData((prevFormData) => ({
      ...prevFormData,
      [groupType]: updatedGroup,
    }));
  };

  const addGroup = (groupType) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [groupType]: [...prevFormData[groupType], { priority: [{ priority: '', default: '', optional: '' }] }]
    }));
  };

  const removeGroup = (groupType, index) => {
    const updatedGroup = formData[groupType].filter((_, i) => i !== index);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [groupType]: updatedGroup,
    }));
    onFormSubmit({
      ...formData,
      [groupType]: updatedGroup,
    });
  };

  const removePriority = (groupType, index, priorityIndex) => {
    const updatedGroup = [...formData[groupType]];
    updatedGroup[index].priority = updatedGroup[index].priority.filter((_, i) => i !== priorityIndex);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [groupType]: updatedGroup,
    }));
  };

  const addDescription = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: [...prevFormData.description, { text: '', language: '' }],
    }));
  };

  const removeDescription = (index) => {
    const updatedDescription = formData.description.filter((_, i) => i !== index);
    setFormData((prevFormData) => ({
      ...prevFormData,
      description: updatedDescription,
    }));
    onFormSubmit({
      ...formData,
      description: updatedDescription,
    });
  };

  const addText = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      text: [...prevFormData.text, { text: '', language: '' }],
    }));
  };

  const removeText = (index) => {
    const updatedText = formData.text.filter((_, i) => i !== index);
    setFormData((prevFormData) => ({
      ...prevFormData,
      text: updatedText,
    }));
    onFormSubmit({
      ...formData,
      text: updatedText,
    });
  };

  const commonFields = [
    { name: 'XML ID', key: 'xmlID' },
    { name: 'Descriptions', key: 'description', isDescription: true },
  ];

  // Visual Item 공통 필드 정의
  const visualItemFields = [
    { name: 'Item Detail', key: 'itemDetail' },
    { name: 'Preview Image', key: 'previewImage' },
    { name: 'Engineering Image', key: 'engineeringImage' },
    { name: 'Preview Type', key: 'previewType' },
    { name: 'Engineering Image Type', key: 'engineeringImageType' },
  ];

  const specificFields = {
    'Symbol': visualItemFields,
    'LineStyle': visualItemFields,
    'AreaFill': visualItemFields,
    'Pixmap': visualItemFields,
    'SymbolSchema': [
        { name: 'XML Schema', key: 'xmlSchema', isXML: true },
    ],
    'LineStyleSchema': [
        { name: 'XML Schema', key: 'xmlSchema', isXML: true },
    ],
    'AreaFillSchema': [
        { name: 'XML Schema', key: 'xmlSchema', isXML: true },
    ],
    'PixmapSchema': [
        { name: 'XML Schema', key: 'xmlSchema', isXML: true },
    ],
    'ColourProfileSchema': [
        { name: 'XML Schema', key: 'xmlSchema', isXML: true },
    ],
    'ColourToken': [
        { name: 'Token', key: 'token' },
    ],
    'PaletteItem': [
      { name: 'Transparency', key: 'transparency' },
      { name: 'Red (sRGB)', key: 'colourValue.sRGB.red' },
      { name: 'Green (sRGB)', key: 'colourValue.sRGB.green' },
      { name: 'Blue (sRGB)', key: 'colourValue.sRGB.blue' },
      { name: 'X (CIE)', key: 'colourValue.cie.x' },
      { name: 'Y (CIE)', key: 'colourValue.cie.y' },
      { name: 'L (CIE)', key: 'colourValue.cie.L' }
    ],
    'ColourPalette': [],
    'DisplayMode': [],
    'DisplayPlane': [
        { name: 'Order', key: 'order' }
    ],
    'ViewingGroupLayer': [],
    'ViewingGroup': [
        { name: 'Foundation Mode', key: 'foundationMode' }
    ],
    'Font': [
        { name: 'Font File', key: 'fontFile' },
        { name: 'Font Type', key: 'fontType' }
    ],
    'ContextParameter': [
      { name: 'Parameter Type', key: 'parameterType' },
      { name: 'Default Value', key: 'defaultValue' }
    ],
    'DrawingPriority': [
        { name: 'Priority', key: 'priority' }
    ],
    'AlertHighlight': [
        { name: 'Optional', key: 'optional' },
        { name: 'Style', key: 'style' }
    ],
    'Alert': [
      { name: 'Route Monitor', key: 'routeMonitor', isGroup: 'routeMonitor' },
      { name: 'Route Plan', key: 'routePlan', isGroup: 'routePlan' },
    ],
    'AlertMessage': [
      { name: 'Text', key: 'text', isText: true },
    ],
  };

  const getTableFields = (itemType) => [
    ...commonFields,
    ...(specificFields[itemType] || []),
  ];

  const fields = getTableFields(itemType);

  return (
    <div style={{ backgroundColor: '#F8F8F8' }}  className="p-3 mt-4">
      <h3>{itemType} Input</h3>

      {fields.length > 0 ? (
        fields.map(({ name, key, isDescription, isText, isGroup }) => (
          <div key={key}>
            {isDescription ? (
              <div>
                <h5>{name}</h5>
                {formData.description.map((desc, index) => (
                  <div key={index} className="input-group input-group-sm mt-2">
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
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeDescription(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-primary mt-2" onClick={addDescription}>
                  Add Description
                </button>
              </div>
            ) : isText ? (
              <div>
                <h5>{name}</h5>
                {formData.text.map((txt, index) => (
                  <div key={index} className="input-group input-group-sm mt-2">
                    <input
                      type="text"
                      className="form-control"
                      name="text"
                      placeholder="Text"
                      value={txt.text}
                      onChange={(e) => handleTextChange(index, e)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      name="language"
                      placeholder="Language"
                      value={txt.language}
                      onChange={(e) => handleTextChange(index, e)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeText(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-primary mt-2" onClick={addText}>
                  Add Text
                </button>
              </div>
            ) : isGroup ? (
              <div>
                <h5>{name}</h5>
                {formData[isGroup].map((group, index) => (
                  <div key={index}>
                    {group.priority.map((priority, priorityIndex) => (
                      <div key={priorityIndex} className="input-group input-group-sm mt-2">
                        <input
                          type="text"
                          className="form-control"
                          name="priority"
                          placeholder="Priority"
                          value={priority.priority}
                          onChange={(e) => handlePriorityChange(isGroup, index, priorityIndex, e)}
                        />
                        <input
                          type="text"
                          className="form-control"
                          name="default"
                          placeholder="Default"
                          value={priority.default}
                          onChange={(e) => handlePriorityChange(isGroup, index, priorityIndex, e)}
                        />
                        <input
                          type="text"
                          className="form-control"
                          name="optional"
                          placeholder="Optional"
                          value={priority.optional}
                          onChange={(e) => handlePriorityChange(isGroup, index, priorityIndex, e)}
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removePriority(isGroup, index, priorityIndex)}
                        >
                          Remove Priority
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={() => addPriority(isGroup, index)}
                    >
                      Add Priority
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger mt-2"
                      onClick={() => removeGroup(isGroup, index)}
                    >
                      Remove Group
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-primary mt-2"
                  onClick={() => addGroup(isGroup)}
                >
                  Add Group
                </button>
              </div>
            ) : (
              <div className="input-group input-group-sm mt-2">
                <span className="input-group-text" style={{ width: '40%', fontWeight: 'bold' }}>
                  {name}
                </span>
                <input
                  type="text"
                  className="form-control"
                  name={key}
                  placeholder={`Enter ${name}`}
                  value={key.split('.').reduce((acc, part) => acc && acc[part], formData) || ''}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No fields available for {itemType}</p>
      )}
    </div>
  );
};

export default DynamicItemForm;
