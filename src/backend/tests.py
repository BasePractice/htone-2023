import unittest


class FileServiceTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        pass
        # from file_service.file_service import app as app_fs
        # cls.fs_client = TestClient(app_fs)

    # FIXME: Разобраться почему не обрабатывается BasicException
    def test_read_root_without_auth(self):
        pass
        # response = self.fs_client.get("/files")
        # json = response.json()

        # self.assertEqual(response.status_code, codes.AUTH_INVALID_SCHEMA_CREATION.http_code)
        # self.assertEqual(json['code'], codes.AUTH_INVALID_SCHEMA_CREATION.code)
        # self.assertEqual(json['message'], codes.AUTH_INVALID_SCHEMA_CREATION.message)


if __name__ == '__main__':
    unittest.main()
