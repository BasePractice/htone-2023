import asyncio
import logging

import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning

from settings import LOGLEVEL
from telegram_service import dispatcher

if __name__ == "__main__":
    logging.basicConfig(
        format='%(asctime)s %(levelname)s (%(threadName)s)[%(filename)s:%(funcName)s:%(lineno)d] %(message)s',
        level=logging.getLevelName(LOGLEVEL))
    requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
    dispatcher()
