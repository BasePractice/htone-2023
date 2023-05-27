import logging

import requests
import uvicorn
from requests.packages.urllib3.exceptions import InsecureRequestWarning

from settings import LOGLEVEL

if __name__ == "__main__":
    logging.basicConfig(
        format='%(asctime)s %(levelname)s (%(threadName)s)[%(filename)s:%(funcName)s:%(lineno)d] %(message)s',
        level=logging.getLevelName(LOGLEVEL))
    requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
    uvicorn.run("file_service:app", host="0.0.0.0", port=8081, reload=False, access_log=False)
