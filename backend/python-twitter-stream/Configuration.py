"""A Class Holding static Configuration Variables



"""


class Configuration:

    # MySQL Access Data
    mMusicBrainzDatabaseHost = "localhost"
    mMusicBrainzDatabaseUser = "root"
    mMusicBrainzDatabasePW   = "password"
    mMusicBrainzDatabaseDB  = "mbdb"

    # Redis Access Data
    mRedisHost = "127.0.0.1"
    mRedisPW = ""
    mRedisPort = 6379



    #Twitter Streaming socket
    mStreamingHost = "localhost"
    mStreamingPort = 2049
