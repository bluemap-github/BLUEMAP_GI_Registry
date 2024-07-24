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
        default:
            return [];
    }
};

const validationList = {
    ReferenceSource:  ['referenceIdentifier', 'sourceDocument', 'similarity'],
    Reference:  ['referenceIdentifier', 'sourceDocument'],
    ManagementInfo:  [
                'proposalType', 
                'submittingOrganisation',
                'proposedChange',
                'dateProposed',
                'dateAmended',
                'proposalStatus',
            ]
};

const validateFormData = (formData, formType) => {
    const validateList = getValidationItem(formType);
    // item 검사
    const missingFields = validateList.filter(field => 
        formData[field] === undefined || 
        formData[field] === null || 
        (Array.isArray(formData[field]) && formData[field].length === 0) || 
        (typeof formData[field] === 'string' && formData[field].trim() === '')
    );
    // for () {};
    
    if (missingFields.length > 0) {
        alert(` [${formType}] The following fields are missing or empty: ${missingFields.join(', ')}`);
        return false;
    } else {
        return true;
    }
    
};

const PostList = {
    
}

const checkPostList = (item, attributeContsraints, managementInfos, referenceSource, references, validateType) => {
    console.log('item:', item);
    console.log('attributeContsraints:', attributeContsraints);
    console.log('managementInfos:', managementInfos);
    console.log('referenceSource:', referenceSource);
    console.log('references:', references);
    console.log('validateType:', validateType);
};

export { validateFormData, checkPostList };