const getValidationItem = (formType) => {
    switch (formType) {
        case 'Symbol':
        case 'LineStyle':
        case 'AreaFill':
        case 'Pixmap':
            return ['xmlID'];
        case 'SymbolSchema':
        case 'LineStyleSchema':
        case 'AreaFillSchema':
        case 'PixmapSchema':
        case 'ColourProfileSchema':
            return ['xmlID', 'xmlSchema'];
        case 'ColourToken':
            return ['xmlID', 'token'];
        case 'PaletteItem':
            return ['xmlID'];
        case 'ColourPalette':
            return ['xmlID'];
        case 'DisplayPlane':
            return ['xmlID', 'order'];
        case 'DisplayMode':
            return ['xmlID'];
        case 'ViewingGroupLayer':
            return ['xmlID'];
        case 'ViewingGroup':
            return ['xmlID', 'foundationMode'];
        case 'Font':
            return ['xmlID', 'fontFile', 'fontType'];
        case 'ContextParameter':
            return ['xmlID'];
        case 'DrawingPriority':
            return ['xmlID', 'priority'];
        case 'Alert':
            return ['xmlID'];
        case 'AlertHighlight':
            return ['xmlID', 'optional', 'style'];
        case 'AlertMessage':
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
    if (!formData) {
        alert(`[${formType}] The form data is missing or null.`);
        return false;
    }

    const validateList = getValidationItem(formType);

    const missingFields = validateList.reduce((missing, field) => {
        const fieldParts = field.split('.');
        let value = formData;

        for (let part of fieldParts) {
            if (value && typeof value === 'object') {
                value = value[part];
            } else {
                value = undefined;
                break;
            }
        }

        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) {
            missing.push(field);
        }

        return missing;
    }, []);

    if (missingFields.length > 0) {
        alert(`[${formType}] The following fields are missing or empty: ${missingFields.join(', ')}`);
        return false;
    } else {
        return true;
    }
};

export { performValidation };
