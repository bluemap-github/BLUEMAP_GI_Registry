from mongo_driver import db

S100_Concept_Register = db['S100_Concept_Register']

S100_Concept_ManagementInfo = db['S100_Concept_ManagementInfo']
S100_Concept_ReferenceSource = db['S100_Concept_ReferenceSource']
S100_Concept_Reference = db['S100_Concept_Reference']
S100_Concept_Item = db['S100_Concept_Item']

S100_CD_AttributeConstraints = db['S100_CD_AttributeConstraints']
S100_CD_AttributeUsage = db['S100_CD_AttributeUsage']

S100_Portrayal_Item = db['S100_Portrayal_Item']


import datetime
class RegiModel:
    @staticmethod
    def update_date(registry_id):
        date = datetime.datetime.now().strftime("%Y-%m-%d")
        S100_Concept_Register.update_one({"_id": registry_id}, {"$set": {"dateOfLastChange": date}})
