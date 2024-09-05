const getValidationItem = (formType) => {
    switch (formType) {
        case 'ConceptItem':
            return ['name', 'itemStatus'];
        case 'SimpleAttribute':
            return ['name', 'itemStatus', 'valueType'];
        case 'ComplexAttribute':
            return ['name', 'itemStatus', 'subAttribute'];
        case 'Feature':
            return ['name', 'itemStatus', 'featureUseType'];
        case 'Information':
            return ['name', 'itemStatus'];
        case 'EnumeratedValue':
            return ['name', 'attributeId', 'enumType'];
        // case 'AttributeConstraints':
        //     return [];
        case 'ManagementInfo':
            return [
                'proposalType',
                'submittingOrganisation',
                'proposedChange',
                'dateProposed',
                'dateAmended',
                'proposalStatus',
            ];
        case 'ReferenceSource':
            return ['referenceIdentifier', 'sourceDocument', 'similarity'];
        case 'Reference':
            return ['referenceIdentifier', 'sourceDocument'];
        default:
            return [];
    }
};

const performValidation = (formData, formType) => {
    // formData가 null 또는 undefined인 경우 경고를 표시하고 검증 실패로 처리
    if (!formData) {
        alert(`[${formType}] The form data is missing or null.`);
        return false;
    }

    const validateList = getValidationItem(formType);
    const missingFields = validateList.filter(field =>
        formData[field] === undefined ||
        formData[field] === null ||
        (Array.isArray(formData[field]) && formData[field].length === 0) ||
        (typeof formData[field] === 'string' && formData[field].trim() === '')
    );

    if (missingFields.length > 0) {
        alert(`[${formType}] The following fields are missing or empty: ${missingFields.join(', ')}`);
        return false;
    } else {
        return true;
    }
};


const checkPostList = (item, attributeContsraints, managementInfos, referenceSource, references, validateType) => {
    console.log('item:', item);
    console.log('attributeContsraints:', attributeContsraints);
    console.log('managementInfos:', managementInfos);
    console.log('referenceSource:', referenceSource);
    console.log('references:', references);
    console.log('validateType:', validateType);
};

export { performValidation, checkPostList };