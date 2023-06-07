import unittest

from starlette.testclient import TestClient

from tests_common import ADMIN_AUTH_HEADERS


class FileServiceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from file_service import app as app_fs
        cls.fs = TestClient(app_fs)

    def test_get_files_without_auth(self):
        response = self.fs.get("/files")
        self.assertEqual(response.status_code, 401)

    def test_get_files(self):
        response = self.fs.get("/files", headers=ADMIN_AUTH_HEADERS)
        self.assertEqual(response.status_code, 200)

    def test_get_files_kinds(self):
        response = self.fs.get("/files/dict/kinds")
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertTrue(len(json) > 0)

    def test_get_files_types(self):
        response = self.fs.get("/files/dict/types")
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertTrue(len(json) > 0)


if __name__ == '__main__':
    unittest.main()
