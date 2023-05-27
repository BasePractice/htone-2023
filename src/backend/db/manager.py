from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from settings import PG_USERNAME, PG_PASSWORD, PG_HOSTNAME, PG_DATABASE

default = create_engine(f"postgresql://{PG_USERNAME}:{PG_PASSWORD}@{PG_HOSTNAME}/{PG_DATABASE}",
                        pool_size=10,
                        # echo_pool="debug",
                        echo=False)

Session = sessionmaker(bind=default, autoflush=False)
