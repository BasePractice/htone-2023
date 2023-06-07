import hashlib
import os

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

ROLE_ADMIN = 'ROLE_ADMIN'
ROLE_TENANT = 'ROLE_TENANT'
ROLE_LANDLORD = 'ROLE_LANDLORD'

PG_USERNAME = os.getenv('PG_USERNAME', 'postgres')
PG_PASSWORD = os.getenv('PG_PASSWORD', 'postgreHTone_042023')
PG_HOSTNAME = os.getenv('PG_HOSTNAME', '127.0.0.1:25432')
PG_DATABASE = os.getenv('PG_DATABASE', 'htone_042023')

MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY', 'minio_admin')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY', 'postgreHTone_042023')
MINIO_URL = os.getenv('MINIO_URL', '192.168.1.14:9000')
MINIO_BUCKET = os.getenv('MINIO_BUCKET', 'leader2023')

KEYCLOAK_URL = os.getenv('KEYCLOAK_URL', 'https://cluster.sigm-a.ru:8443')
KEYCLOAK_REALM = os.getenv('KEYCLOAK_REALM', 'sigm-a')
KEYCLOAK_CLIENT_ID = os.getenv('KEYCLOAK_CLIENT_ID', 'admin-cli')
KEYCLOAK_CLIENT_SECRET = os.getenv('KEYCLOAK_CLIENT_SECRET')
KEYCLOAK_USERNAME = os.getenv('KEYCLOAK_USERNAME', 'user_service')
KEYCLOAK_PASSWORD = os.getenv('KEYCLOAK_PASSWORD', 'user_service')
KEYCLOAK_LOGIN_CLIENT_ID = os.getenv('KEYCLOAK_LOGIN_CLIENT_ID', 'leader2023')

REDIS_URL = os.getenv('REDIS_URL', '192.168.1.14')
REDIS_PORT = os.getenv('REDIS_PORT', '6379')

CACHE_USERS_EXPIRE = os.getenv('CACHE_USERS_EXPIRE', '300')
CACHE_USERS_LIMITS = os.getenv('CACHE_USERS_LIMITS', '10000')

KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092')
KAFKA_NOTIFICATIONS_TOPIC = os.getenv('KAFKA_NOTIFICATIONS_TOPIC', 'notifications')

MAIL_HOSTNAME = os.getenv("MAIL_HOSTNAME", "smtp.mail.ru")
MAIL_USERNAME = os.getenv("MAIL_USERNAME", "sigmas@internet.ru")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "gE0B7GJms0vn0s7d0kWq")
MAIL_FROM_ADDRESS = os.getenv("MAIL_FROM_ADDRESS", "sigmas@internet.ru")

LOGLEVEL = os.getenv('LOGLEVEL', 'INFO')

API_GATEWAY_URL = os.getenv("API_GATEWAY_URL", "http://192.168.1.14:8080/api/v1")
# API_GATEWAY_URL = os.getenv("API_GATEWAY_URL", "https://cluster.sigm-a.ru/api/v1")
INTERNAL_FILE_SERVICE = os.getenv("INTERNAL_FILE_SERVICE", "http://htone-files:8081")
INTERNAL_USER_SERVICE = os.getenv("INTERNAL_USER_SERVICE", "http://htone-users:8082")
INTERNAL_ORGS_SERVICE = os.getenv("INTERNAL_ORGS_SERVICE", "http://htone-orgs:8083")
INTERNAL_DICT_SERVICE = os.getenv("INTERNAL_DICT_SERVICE", "http://htone-dict:8084")
INTERNAL_PLATFORM_SERVICE = os.getenv("INTERNAL_PLATFORM_SERVICE", "http://htone-platforms:8085")
INTERNAL_BOOKING_SERVICE = os.getenv("INTERNAL_BOOKING_SERVICE", "http://htone-booking:8086")
INTERNAL_ATTRIBUTE_SERVICE = os.getenv("INTERNAL_ATTRIBUTE_SERVICE", "http://htone-attributes:8088")

OPENAPI_CONTACT = {
    "name": "Разработчики",
    "url": "https://sigm-a.ru",
    "email": "support@sigm-a.ru"
}

OPENAPI_LICENSE = {
    "name": "MIT",
    "url": "https://opensource.org/license/mit/"
}

OPENAPI_TAGS = [
    {
        "name": "files",
        "description": "Операции с файлами"
    },
    {
        "name": "dicts",
        "description": "Справочники"
    },
    {
        "name": "users",
        "description": "Операции с пользователями"
    },
    {
        "name": "opens",
        "description": "Операции не требующие авторизации"
    },
    {
        "name": "feedbacks",
        "description": "Операции с отзывами"
    },
    {
        "name": "attributes",
        "description": "Операции с атрибутами"
    },
    {
        "name": "companies",
        "description": "Операции с компаниями"
    },
    {
        "name": "booking",
        "description": "Операции с бронированием"
    }
]

backend = default_backend()
CRYPTO_PASSWORD = os.getenv("CRYPTO_PASSWORD", "HTONE_P@ssw0RD")
CRYPTO_SALT = os.getenv("CRYPTO_SALT", '\x28\xAB\xBB\xCC\xDD\xEE\x00\x77')
CRYPTO_KEY = hashlib.sha512((CRYPTO_PASSWORD + CRYPTO_SALT).encode()).digest()
(CRYPTO_DK, CRYPTO_IV) = (CRYPTO_KEY[:32], CRYPTO_KEY[31:47])
CRYPTO = Cipher(algorithms.AES(CRYPTO_DK), modes.CBC(CRYPTO_IV))


# LINK: https://gist.github.com/btoueg/f71b62f456550da42ea9f4a4bd907d21
class Crypto:
    @staticmethod
    def fix_binary_data_length(binary_data: bytes):
        """
        Right padding of binary data with 0 bytes
        Fix "ValueError: The length of the provided data is not a multiple of the block length."
        """
        block_length = 16
        binary_data_length = len(binary_data)
        length_with_padding = (
                binary_data_length + (block_length - binary_data_length) % block_length
        )
        return binary_data.ljust(length_with_padding, b"\0"), binary_data_length

    @staticmethod
    def encrypt(binary_data: bytes):
        binary_data, binary_data_length = Crypto.fix_binary_data_length(binary_data)
        iv = os.urandom(
            16
        )  # does not need to be secret, but must be unpredictable at encryption time

        # AES (Advanced Encryption Standard) is a block cipher standardized by NIST. AES is both fast, and cryptographically strong. It is a good default choice for encryption.
        # CBC (Cipher Block Chaining) is a mode of operation for block ciphers. It is considered cryptographically strong. (see https://cryptography.io/en/latest/hazmat/primitives/symmetric-encryption/#cryptography.hazmat.primitives.ciphers.modes.CBC)
        cipher = Cipher(algorithms.AES(CRYPTO_DK), modes.CBC(iv), backend=backend)
        enc = cipher.encryptor()
        encrypted_data = enc.update(binary_data) + enc.finalize()
        stored_encrypted_data = "{iv}:{binary_data_length}:{encrypted_data}".format(
            iv=iv.hex().upper(),
            binary_data_length=binary_data_length,
            encrypted_data=encrypted_data.hex().upper(),
        )
        return stored_encrypted_data

    @staticmethod
    def decrypt(stored_encrypted_data: str):
        iv, binary_data_length, encrypted_data = stored_encrypted_data.split(":")
        iv = bytes.fromhex(iv)
        encrypted_data = bytes.fromhex(encrypted_data)
        binary_data_length = int(binary_data_length)
        cipher = Cipher(algorithms.AES(CRYPTO_DK), modes.CBC(iv), backend=backend)
        dec = cipher.decryptor()
        decrypted_data = dec.update(encrypted_data) + dec.finalize()

        return decrypted_data[:binary_data_length]
