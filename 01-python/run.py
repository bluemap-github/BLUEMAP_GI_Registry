from sample_data import Register_data, Registerltem_data, Managementinfo_data
import register_model
from validation import enumValid

proposal_type = register_model.S100_RE_ProposalType
proposal_status = register_model.S100_RE_ProposalStatus
similarity_to_source = register_model.S100_RE_SimilarityToSource
item_status = register_model.S100_RE_ItemStatus


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
        enumValid(proposal_type, Managementinfo_data["proposal Type"]),
        Managementinfo_data["submittingOrganisation"],
        Managementinfo_data["proposedChange"],
        Managementinfo_data["dateProposed"],
        Managementinfo_data["dateAmended"],
        enumValid(proposal_status, Managementinfo_data["proposal Status"])
    )

    RegisterItem = register_model.S100_RE_RegisterItem(
        Registerltem_data["itemIdentifier"],
        Registerltem_data["name"],
        enumValid(item_status, Registerltem_data["itemStatus"]),
        Managementinfo
    )
    RegisterItem.viewItem()

    """
    3. RegisterItem을 Register에 추가
    """
    print("3. RegisterItem을 Register에 추가\n")
    Register.addItem(RegisterItem)
    
    Register.getRegisterItem()


    """
    4. 등록된 RegisterItem의 속성"remarks" 추가
    """
    print("4. 등록된 RegisterItem의 속성remarks 추가\n")
    for item in Register.s100_RE_RegisterItem:
        if item.name == "item1":
            item.addRemarks("remarks1")
            item.viewItem()
    
    
