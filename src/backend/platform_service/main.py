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

    requests_log = logging.getLogger("requests.packages.urllib3")
    requests_log.setLevel(logging.DEBUG)
    requests_log.propagate = True

    uvicorn.run("platform_service:app", host="0.0.0.0", port=8085, reload=False, log_level="info")
