import json
import os

SETTINGS_JSON_FILE = os.getenv('SETTINGS_JSON_FILE', 'http-client.env.json')
SETTINGS_CATEGORY = os.getenv('SETTINGS_CATEGORY', 'dev')
with open(SETTINGS_JSON_FILE, encoding='utf-8') as json_file:
    _local_settings_values = json.load(json_file)
    _local_settings_values = _local_settings_values[SETTINGS_CATEGORY]
    _map = {}
    for _key, _value in _local_settings_values.items():
        _map[_key.upper().replace('-', '_')] = _value
    _local_settings_values = _map


def _local_settings(k: str, _value: str = None) -> str:
    if k in _local_settings_values:
        v = _local_settings_values[k]
        if v is None:
            return _value
        return v
    return _value


def settings(k: str) -> str:
    return os.getenv(k.upper().replace('-', '_'), _local_settings(k))


ADMIN_ACCESS_TOKEN: str = settings('ADMIN_ACCESS_TOKEN')
ADMIN_USER_ID: str = settings('ADMIN_USER_ID')
ADMIN_AUTH_HEADERS = {
    "Authorization": f"Bearer {ADMIN_ACCESS_TOKEN}",
    "X-User": ADMIN_USER_ID,
    "X-Resource-Roles": "ROLE_ADMIN"
}

TONANT_ACCESS_TOKEN: str = settings('TONANT_ACCESS_TOKEN')
TONANT_USER_ID: str = settings('TONANT_USER_ID')
TONANT_AUTH_HEADERS = {
    "Authorization": f"Bearer {TONANT_ACCESS_TOKEN}",
    "X-User": TONANT_USER_ID,
    "X-Resource-Roles": "ROLE_TONANT"
}

LANDLORD_ACCESS_TOKEN: str = settings('LANDLORD_ACCESS_TOKEN')
LANDLORD_USER_ID: str = settings('LANDLORD_USER_ID')
LANDLORD_AUTH_HEADERS = {
    "Authorization": f"Bearer {LANDLORD_ACCESS_TOKEN}",
    "X-User": LANDLORD_USER_ID,
    "X-Resource-Roles": "ROLE_LANDLORD"
}
