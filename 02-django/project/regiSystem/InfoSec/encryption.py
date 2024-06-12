from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
from django.conf import settings
import base64
import json

def encrypt(data):
    key = settings.ENCRYPTION_KEY
    iv = get_random_bytes(16)
    encoded_data = data.encode()

    # AES 암호화 설정 (CBC 모드 사용)
    cipher = AES.new(key, AES.MODE_CBC, iv)

    # 데이터 암호화
    ciphertext = cipher.encrypt(pad(encoded_data, AES.block_size))

    # 암호화된 데이터와 IV를 Base64로 인코딩하여 JSON으로 반환
    encrypted_data = base64.b64encode(ciphertext).decode('utf-8')
    encoded_iv = base64.b64encode(iv).decode('utf-8')

    return json.dumps({"encrypted_data": encrypted_data, "iv": encoded_iv})


def decrypt(encrypted_data, encoded_iv):
    key = settings.ENCRYPTION_KEY

    # Base64로 인코딩된 암호화된 데이터와 IV를 디코딩
    ciphertext = base64.b64decode(encrypted_data)
    iv = base64.b64decode(encoded_iv)

    # AES 복호화 설정 (CBC 모드 사용)
    cipher = AES.new(key, AES.MODE_CBC, iv)

    # 데이터 복호화 및 패딩 제거
    decrypted_data = unpad(cipher.decrypt(ciphertext), AES.block_size)

    return decrypted_data.decode('utf-8')