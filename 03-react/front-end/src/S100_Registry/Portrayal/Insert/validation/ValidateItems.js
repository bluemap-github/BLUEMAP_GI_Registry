const getValidationItem = (formType) => {
    switch (formType) {
        case 'Symbol':
            return ['xmlID'];
        case 'LineStyle':
            return ['xmlID'];
        case 'AreaFill':
            return ['xmlID'];
        case 'Pixmap':
            return ['xmlID'];
        case 'SymbolSchema':
            return ['xmlID', 'xmlSchema'];
        case 'LineStyleSchema':
            return ['xmlID', 'xmlSchema'];
        case 'AreaFillSchema':
            return ['xmlID', 'xmlSchema'];
        case 'PixmapSchema':
            return ['xmlID', 'xmlSchema'];
        case 'ColourProfileSchema':
            return ['xmlID', 'xmlSchema'];
        case 'ColourToken':
            return ['xmlID', 'token'];
        case 'PaletteItem':
            return ['xmlID', 'colourValue'];
        case 'ColourPalette':
            return ['xmlID'];
        case 'ManagementInfo':
            return [
                'proposalType',
                'submittingOrganisation',
                'proposedChange',
                'dateProposed',
                'dateAmended',
                'proposalStatus',
            ];
        case 'ConceptItem':
            return ['name', 'itemStatus'];
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
}

export { performValidation };