from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
from django.conf import settings
import base64
import json

def encrypt(data):
    data[0] = str(data[0])
    key = settings.ENCRYPTION_KEY
    iv = get_random_bytes(16)
    encoded_data = data[0].encode()
    cipher = AES.new(key, AES.MODE_CBC, iv)
    ciphertext = cipher.encrypt(pad(encoded_data, AES.block_size))
    if len(data) == 1:
        encrypted_data = base64.b64encode(ciphertext).decode('utf-8')
        encoded_iv = base64.b64encode(iv).decode('utf-8')
        return json.dumps({"encrypted_data": encrypted_data, "iv": encoded_iv})
    else:
        encrypted_data = base64.b64encode(ciphertext).decode('utf-8')
        encoded_iv = base64.b64encode(iv).decode('utf-8')
        return json.dumps({"encrypted_data": encrypted_data, "iv": encoded_iv, "name": data[1], "itemType": data[2]})

def get_encrypted_id(data):
    encrypted_id_json = encrypt(data)
    encrypted_id_data = json.loads(encrypted_id_json)
    return encrypted_id_data


def decrypt(encrypted_data, encoded_iv):
    key = settings.ENCRYPTION_KEY
    ciphertext = base64.b64decode(encrypted_data)
    iv = base64.b64decode(encoded_iv)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted_data = unpad(cipher.decrypt(ciphertext), AES.block_size)
    return decrypted_data.decode('utf-8')