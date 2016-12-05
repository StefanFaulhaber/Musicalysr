from Configuration import Configuration
from helpers import printProgress
import redis
from mysql import connector

class REDISinit:
    mRedisConn = redis.Redis
    mRedisConn_Usernames = redis.Redis
    mRedisConn_Alias = redis.Redis
    mMySQLConn = connector

    def __init__(self):
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

        self.mMySQLConn = connector.connect(host=Configuration.mMusicBrainzDatabaseHost,
                                            user=Configuration.mMusicBrainzDatabaseUser,
                                            database=Configuration.mMusicBrainzDatabaseDB)

    def initializeREDIS(self):
        """ Building a Redis index for quickly identifying Instances in Tweets. (May take a long time

        Returns:

        """
        fSQL = "select " \
               "a.name,w.name " \
               "from (Select name,id from artist) as a " \
               "join l_artist_work as lau on (a.id=lau.entity0) " \
               "join work as w on (w.id=lau.entity1);"

        #

        nameArray = []
        fSQL_GetNameAndID = "Select id,name from artist"
        cursor = self.mMySQLConn.cursor()
        cursor.execute(fSQL_GetNameAndID)
        nameArray = cursor.fetchall()
        numberOfArtists = len(nameArray)
        i = 0
        printProgress(i, numberOfArtists,
                      prefix='Progress Building Redis: ', suffix='Complete', barLength=50)

        for id, name in nameArray:
            i += 1
            if i % 100 == 0:
                printProgress(i, numberOfArtists,
                              prefix='Progress Building Redis: ', suffix=str(i) + "/" + str(numberOfArtists), barLength=50)

            fSQL_getTwitterUsername = "select url from " \
                                      "(select entity1 from l_artist_url where entity0 = " + str(id) + ") as e " \
                                                                                                       "join url on (url.id = e.entity1)" \
                                                                                                       "where url like \"%twitter%\""
            cursor.execute(fSQL_getTwitterUsername)
            for twitter in cursor:
                username = "@" + twitter[0].split("/")[-1]
                # print("username:   \t", username, name, "\n")
                self.mRedisConn_Usernames.sadd("@" + username.upper(), name)

            fSQL_getAliasByID = "select name from artist_alias where artist=" + str(id)
            cursor.execute(fSQL_getAliasByID)
            for alias in cursor:
                # print("Alias:\t",alias[0].upper(), name.upper())
                self.mRedisConn_Alias.set(alias[0].upper(), name)



    def initUsernameREDIS(self):
        """
        Initializes a redis database with the Usermap mapped to the artists name for quick lookup of artist names
        Returns:

        """

        nameArray = []
        fSQL_GetNameAndID = "Select id,name from artist"
        cursor = self.mMySQLConn.cursor()
        cursor.execute(fSQL_GetNameAndID)
        nameArray = cursor.fetchall()

        numberOfArtists = len(nameArray)
        i = 0
        printProgress(i, numberOfArtists,
                      prefix='Progress Building Redis: ', suffix='Complete', barLength=50)

        for id,name in nameArray:
            i += 1
            if i % 100 == 0:
                printProgress(i, numberOfArtists,
                              prefix='Progress Building Redis: ', suffix=str(i) + "/" + str(numberOfArtists),
                              barLength=50)

            fSQL_getTwitterUsername = "select url from " \
                                      "(select entity1 from l_artist_url where entity0 = " + str(id) + ") as e " \
                                      "join url on (url.id = e.entity1)" \
                                      "where url like '%twitter%'"

            cursor = self.mMySQLConn.cursor()
            cursor.execute(fSQL_getTwitterUsername)
            for twitter in cursor:
                username = "@" + twitter[0].split("/")[-1]
                # print("username:   \t", username, name, "\n")
                self.mRedisConn_Usernames.set(username.upper(), id)

    def initAliasREDIS(self):
        """
        Initializes a redis database with Aliases of an artist mapped to an artist for quick lookup of artist names
        Returns:

        """
        nameArray = []
        fSQL_GetNameAndID = "Select id,name from artist"
        cursor = self.mMySQLConn.cursor()
        cursor.execute(fSQL_GetNameAndID)
        nameArray = cursor.fetchall()

        numberOfArtists = len(nameArray)
        i = 0
        printProgress(i, numberOfArtists,
                      prefix='Progress Building Redis: ', suffix='Complete', barLength=50)

        for id,name in nameArray:
            i += 1
            if i % 100 == 0:
                printProgress(i, numberOfArtists,
                              prefix='Progress Building Redis: ', suffix=str(i) + "/" + str(numberOfArtists),
                              barLength=50)

            fSQL_getAliasByID = "select name from artist_alias where artist="+str(id)
            cursor.execute(fSQL_getAliasByID)
            for alias in cursor:
                # print("Alias:\t",alias[0].upper(), name.upper())
                self.mRedisConn_Alias.set(alias[0].upper(), id)





def main():
    RI = REDISinit()
    RI.initUsernameREDIS()
    print("\n")
    RI.initAliasREDIS()
    print("\n")

if __name__ == "__main__":
    main()