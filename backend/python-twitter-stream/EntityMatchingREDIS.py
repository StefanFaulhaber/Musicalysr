#!/bin/python
import sys
import time
from Configuration import Configuration
import redis
from mysql import connector
from helpers import printProgress


class EntitySets:
    """
    Class for managment of entitysets and recognition, Redis-based.
    """
    mArtistSet = set
    mLabelSet = set
    mReleaseGroups = set
    mUserNames = set
    mWorkNames = set

    lastMatch = str
#
    mRedisConn = redis.Redis
    mRedisConn_Usernames = redis.Redis
    mRedisConn_Alias = redis.Redis


    def __init__(self):
        """
        Setting up the Redis-Connection
        """
        self.mRedisConn = redis.Redis(host=Configuration.mRedisHost,
                                      port=Configuration.mRedisPort,
                                      password=Configuration.mRedisPW,
                                      db=0)
        self.mRedisConn_Usernames = redis.Redis(host=Configuration.mRedisHost,
                                                port=Configuration.mRedisPort,
                                                password=Configuration.mRedisPW,
                                                db=1)
        self.mRedisConn_Alias = redis.Redis(host=Configuration.mRedisHost,
                                            port=Configuration.mRedisPort,
                                            password=Configuration.mRedisPW,
                                            db=2)


    def recognizeUsername(self, query=[]):
        """
            Check if any of the Username in a given list are Artists contained in the Database
        :param query: list of usernames
        :return: List of the ids of the found artists
        """
        fRedisResult = []
        for q in query:
            redisReturnValue = self.mRedisConn_Usernames.get(q)
            if redisReturnValue != None:
                fRedisResult.append(redisReturnValue.decode('unicode-escape'))
        return fRedisResult

    def recognizeAlias(self, query=[]):
        """
            Check if any of the given query in a list are artist aliases
        :param query: list of queries
        :return: list of artist ids if found
        """
        fRedisResult = []
        for q in query:
            redisReturnValue = self.mRedisConn_Alias.get(q)
            if redisReturnValue != None:
                fRedisResult.append(redisReturnValue.decode('unicode-escape'))
        return fRedisResult


