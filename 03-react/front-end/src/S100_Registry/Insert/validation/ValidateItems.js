const getValidationList = (formType) => {
    switch (formType) {
        case 'Item':
            return ['name', 'itemStatus'];
        case 'SimpleAttribute':
            return ['name', 'attributeType', 'attributeValue'];
        case 'ComplexAttribute':
            return ['name', 'attributeType', 'attributeValue'];
        case 'Feature':
            return ['name', 'featureType', 'featureValue'];
        case 'Information':
            return ['name', 'informationType', 'informationValue'];
        case 'EnumeratedValue':
            return ['name', 'value'];
        case 'ReferenceSource':
            return ['referenceIdentifier', 'sourceDocument', 'similarity'];
        case 'Reference':
            return ['referenceIdentifier', 'sourceDocument'];
        case 'ManagementInfo':
            return [
                    'proposalType', 
                    'submittingOrganisation',
                    'proposedChange',
                    'dateProposed',
                    'dateAmended',
                    'proposalStatus',
                ];
        default:
            return [];
    }
};

const validateFormData = (formData, formType) => {
    const validateList = getValidationList(formType);
    const missingFields = validateList.filter(field => !formData[field]);
    if (missingFields.length > 0) {
        alert(`The following fields are missing or empty: ${missingFields.join(', ')}`);
    }
    return missingFields.length === 0;
};

export default validateFormData;
