export const baseFormData = (registerId) => {
    return {
        concept_id: registerId,
        itemIdentifier: '2',
        name: '',
        definition: '',
        remarks: '',
        itemStatus: '',
        alias: [],
        camelCase: '',
        definitionSource: '',
        reference: '',
        similarityToSource: '',
        justification: '',
        proposedChange: ''
    };
};