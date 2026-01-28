# openApiSystem/utils.py
from rest_framework.response import Response
from openApiSystem.models.registry.item import RE_Access, RE_Register

def check_key_validation(serial, regi_uri):
    regi_res = RE_Register.get_register_by_url(regi_uri)
    if not regi_res:
        return Response({"status": "error", "message": "이 URI에 해당하는 레지스트리는 없습니다."}, status=400)

    acess_res = RE_Access.get_access(regi_res)
    for acess in acess_res:
        if acess['serial_key'] == serial:
            return True
    return Response({"status": "error", "message": "이 레지스트리에 대한 접근 권한이 없습니다."}, status=400)
