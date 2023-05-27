from yoyo import read_migrations, get_backend

from settings import PG_USERNAME, PG_PASSWORD, PG_HOSTNAME, PG_DATABASE

backend = get_backend(f'postgres://{PG_USERNAME}:{PG_PASSWORD}@{PG_HOSTNAME}/{PG_DATABASE}')
migrations = read_migrations('./migrations/sql')

if __name__ == "__main__":
    with backend.lock():
        backend.apply_migrations(backend.to_apply(migrations))
