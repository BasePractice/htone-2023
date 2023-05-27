from yoyo import read_migrations, get_backend

from settings import PG_USERNAME, PG_PASSWORD, PG_HOSTNAME, PG_DATABASE

backend = get_backend(f'postgres://{PG_USERNAME}:{PG_PASSWORD}@{PG_HOSTNAME}/{PG_DATABASE}')
migrations = read_migrations('./sql')
sorted_migrations = sorted(migrations, key=lambda x: x.id, reverse=True)
with backend.lock():
    backend.rollback_migrations(sorted_migrations)
