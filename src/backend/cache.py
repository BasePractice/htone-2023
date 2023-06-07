import json

import redis
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

from settings import REDIS_URL, REDIS_PORT


# FIXME: Необходимо переделать. Сделать обобщенный кеш
class BasicCache(object):
    def __init__(self, namespace: str,
                 host: str = REDIS_URL,
                 port: int = int(REDIS_PORT),
                 limit: int = 1000,
                 expire: int = 5 * 60):
        self.host = host
        self.port = port
        self.limit = limit
        self.expire = expire
        self.namespace = namespace
        try:
            self.connection = redis.StrictRedis(host=self.host,
                                                port=self.port,
                                                db=1,
                                                encoding='utf-8')
        except:
            self.connection = None

    def __make_key(self, key):
        return "Cache.{0}:{1}".format(self.namespace, key)

    def __get_set_name(self):
        return "Cache.{0}:Keys".format(self.namespace)

    def __keys(self):
        return self.connection.smembers(self.__get_set_name())

    def __contains__(self, key):
        return self.connection.sismember(self.__get_set_name(), key)

    def __iter__(self):
        if not self.connection:
            return iter([])
        return iter(["{0}:{1}".format(self.namespace, x) for x in self.connection.smembers(self.__get_set_name())])

    def __len__(self):
        return self.connection.scard(self.__get_set_name())

    def __get(self, key: str) -> object | None:
        if key:
            value = self.connection.get(self.__make_key(key))
            if value is None:
                if not key in self:
                    return None
                self.connection.srem(self.__get_set_name(), key)
                return None
            else:
                return json.loads(value)

    def __store_json(self, key, value, expire=None):
        self.__store(key, json.dumps(value), expire)

    def __store(self, key, value, expire=None):
        set_name = self.__get_set_name()

        while self.connection.scard(set_name) >= self.limit:
            del_key = self.connection.spop(set_name)
            self.connection.delete(self.__make_key(del_key))

        pipe = self.connection.pipeline()
        if expire is None:
            expire = self.expire

        if (isinstance(expire, int) and expire <= 0) or (expire is None):
            pipe.set(self.__make_key(key), value)
        else:
            pipe.setex(self.__make_key(key), expire, value)

        pipe.sadd(set_name, key)
        pipe.execute()

    def __expire_all_in_set(self):
        all_members = self.__keys()
        keys = [self.__make_key(k) for k in all_members]

        with self.connection.pipeline() as pipe:
            pipe.delete(*keys)
            pipe.execute()

        return len(self), len(all_members)

    def __flush(self):
        keys = list(self.__keys())
        keys.append(self.__get_set_name())
        with self.connection.pipeline() as pipe:
            pipe.delete(*keys)
            pipe.execute()

    def fetch(self, user_id: str, fetcher):
        model = self.__get(user_id)
        if model is None:
            model = fetcher(user_id)
            if isinstance(model, BaseModel):
                self.__store(key=user_id, value=model.json())
            elif isinstance(model, list):
                v = jsonable_encoder(model)
                self.__store(key=user_id, value=json.dumps(v))
        return model
