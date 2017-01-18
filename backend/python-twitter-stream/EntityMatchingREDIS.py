#!/bin/python
import sys
import time
from Configuration import Configuration
import redis
from mysql import connector
from helpers import printProgress
import re

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
    mRedisConn_Releases = redis.Redis
    mRedisConn_Usernames = redis.Redis
    mRedisConn_Alias = redis.Redis
    mRedisConn_Work = redis.Redis
    mRedisConn_Artist = redis.Redis
    mRedisConn_AritstIDs = redis.Redis
    mRedisConn_ReleaseIDs = redis.Redis
    mRedisConn_WorkIDs = redis.Redis

    def __init__(self):
        """
        Setting up the Redis-Connection
        """
        self.mRedisConn_Releases = redis.Redis(host=Configuration.mRedisHost,
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
        self.mRedisConn_Work = redis.Redis(host=Configuration.mRedisHost,
                                            port=Configuration.mRedisPort,
                                            password=Configuration.mRedisPW,
                                            db=3)
        self.mRedisConn_Artist = redis.Redis(host=Configuration.mRedisHost,
                                             port=Configuration.mRedisPort,
                                             password=Configuration.mRedisPW,
                                             db=4)

        self.mRedisConn_ArtistIDs = redis.Redis(host=Configuration.mRedisHost,
                                                port=Configuration.mRedisPort,
                                                password=Configuration.mRedisPW,
                                                db=5)
        self.mRedisConn_WorkIDs = redis.Redis(host=Configuration.mRedisHost,
                                              port=Configuration.mRedisPort,
                                              password=Configuration.mRedisPW,
                                              db=6)
        self.mRedisConn_ReleaseIDs = redis.Redis(host=Configuration.mRedisHost,
                                                 port=Configuration.mRedisPort,
                                                 password=Configuration.mRedisPW,
                                                 db=7)

    def recognizeUsername(self, query=[]):
        """
            Check if any of the Username in a given list are Artists contained in the Database
        :param query: list of usernames
        :return: List of the ids of the found artists
        """
        fRedisResult = []
        for q in query:
            redisReturnValue = self.mRedisConn_Usernames.smembers(q.upper())
            if len(redisReturnValue) != 0:
                fRedisResult.append(list(redisReturnValue)[0].decode('utf8'))
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
                fRedisResult.append(redisReturnValue.decode('utf8'))
        return fRedisResult


    def recognizeRelease(self, query=[]):
        """
            Check if any of the given query in a list are artist aliases
        :param query: list of queries
        :return: list of artist ids if found
        """
        fRedisResult = []
        fRedisDict = {}
        for q in query:
            redisReturnValue = self.mRedisConn_Releases.smembers(q)
            if len(redisReturnValue) :
                fRedisResult.append(q.upper())
                redisReturnValue = set([x.decode('utf8') for x in redisReturnValue])
                fRedisDict[q] = redisReturnValue

        return fRedisResult, fRedisDict


    def recognizeWork(self, query=[]):
        """
            Check if any of the given query in a list are artist works
        :param query: list of queries
        :return: list of artist ids if found
        """
        fRedisResult = []
        fRedisDict = {}
        for q in query:
            redisReturnValue = self.mRedisConn_Work.smembers(q.upper())
            if len(redisReturnValue):
                fRedisResult.append(q.upper())
                redisReturnValue = set([x.decode('utf8') for x in redisReturnValue])
                fRedisDict[q] = redisReturnValue
        return fRedisResult, fRedisDict


    def recognizeArtists(self, query=[]):
        """
            Check if any of the given query in a list are artist aliases
        :param query: list of queries
        :return: list of artist ids if found
        """
        fRedisResult = []
        for q in query:
            redisReturnValue = self.mRedisConn_Artist.get(q)
            if redisReturnValue != None:
                fRedisResult.append(redisReturnValue.decode('utf-8'))
        return fRedisResult


    def getID(self,type, key):

        key= re.sub(r'[\W]+', '', key).upper()

        if type== "artist":
            return int(self.mRedisConn_ArtistIDs.get(key))
        if type== "work":
            return int(self.mRedisConn_WorkIDs.get(key))
        if type== "release":
            return int(self.mRedisConn_ReleaseIDs.get(key))
