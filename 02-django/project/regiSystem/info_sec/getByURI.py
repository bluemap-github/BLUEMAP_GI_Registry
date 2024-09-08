from regiSystem.models.Concept import S100_Concept_Register

def uri_to_serial(uri):
    if not uri:
        return None
    s_item = S100_Concept_Register.find_one({'uniformResourceIdentifier': uri})
    if not s_item:
        return None
    return s_item["_id"]