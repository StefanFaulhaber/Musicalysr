"""A Class Holding static Configuration Variables



"""


class Configuration:



    mMusicCategorizationHashtagList = ["NowPlaying", "NewRelease"]



    # MySQL Access Data
    mMusicBrainzDatabaseHost = "localhost"
    mMusicBrainzDatabaseUser = "root"
    mMusicBrainzDatabasePW   = ""
    mMusicBrainzDatabaseDB  = "mbdb"

    # Redis Access Data
    mRedisHost = "127.0.0.1"
    mRedisPW = ""
    mRedisPort = 6379



    # Twitter Endpoint
    mStreamingHost = "localhost"
    mStreamingPort = 2049
    mSizeOfNGramsForMatching= 5

    #Database Endpoint
    mDatabaseEndpointURL = "http://localhost:3000"
