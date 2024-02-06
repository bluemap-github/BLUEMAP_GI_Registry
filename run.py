from sample_data import Register_data, Registerltem_data, Managementinfo_data
import register_model

proposal_type = register_model.S100_RE_ProposalType
proposal_status = register_model.S100_RE_ProposalStatus
similarity_to_source = register_model.S100_RE_SimilarityToSource
item_status = register_model.S100_RE_ItemStatus

def selectEnum(enum, find):
    for constant in enum:
        if constant.value == find:
            return constant
    raise ValueError("no value")


def run():
    """
    1. Register 생성
    """
    print("1. Register 생성\n")
    Register = register_model.S100_RE_Register(
        Register_data["name"],
        Register_data["operatingLanguage"],
        Register_data["contentSummary"],
        Register_data["uniformResourceldentifier"],
        Register_data["dateOfLastChange"]
    )
    Register.viewItem()

    """
    2. RegisterItem 생성
    """
    print("2. RegisterItem 생성\n")
    Managementinfo = register_model.S100_RE_ManagementInfo(
        selectEnum(proposal_type, Managementinfo_data["proposal Type"]),
        Managementinfo_data["submittingOrganisation"],
        Managementinfo_data["proposedChange"],
        Managementinfo_data["dateProposed"],
        Managementinfo_data["dateAmended"],
        selectEnum(proposal_status, Managementinfo_data["proposal Status"])
    )

    RegisterItem = register_model.S100_RE_RegisterItem(
        Registerltem_data["itemIdentifier"],
        Registerltem_data["name"],
        selectEnum(item_status, Registerltem_data["itemStatus"]),
        Managementinfo
    )
    RegisterItem.viewItem()

    """
    3. RegisterItem을 Register에 추가
    """
    print("3. RegisterItem을 Register에 추가\n")
    Register.addItem(RegisterItem)
    
    Register.getRegisterItem()
