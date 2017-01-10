from Configuration import Configuration
from helpers import printProgress
import redis
from mysql import connector
import re

class REDISinit:
    mRedisConn_Releases = redis.Redis
    mRedisConn_Usernames = redis.Redis
    mRedisConn_Alias = redis.Redis
    mRedisConn_Work = redis.Redis
    mRedisConn_Artist= redis.Redis
    mRedisConn_AritstIDs = redis.Redis
    mRedisConn_ReleaseIDs = redis.Redis
    mRedisConn_WorkIDs = redis.Redis
    mMySQLConn = connector

    def __init__(self):
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


            self.mRedisConn_Artist.set(name.encode('UTF-8').upper(),name)
            self.mRedisConn_ArtistIDs.set(re.sub(r'[\W]+', '', name).encode('UTF-8').upper(), id)

            fSQL_getTwitterUsername = "select url from " \
                                      "(select entity1 from l_artist_url where entity0 = " + str(id) + ") as e " \
                                      "join url on (url.id = e.entity1)" \
                                      "where url like \"%twitter%\""
            cursor.execute(fSQL_getTwitterUsername)
            for twitter in cursor:
                username = "@" + twitter[0].split("/")[-1]
                # print("username:   \t", username, name, "\n")
                self.mRedisConn_Usernames.sadd(username.upper(), id)

            fSQL_getAliasByID = "select name from artist_alias where artist=" + str(id)
            cursor.execute(fSQL_getAliasByID)
            for alias in cursor:
                self.mRedisConn_Alias.set(re.sub(r'[\W]+', '', alias[0]).encode('UTF-8').upper(), id)


            fSQL_getAlbumByID = "select name,rg.id from (select artist_credit, position " \
                                "from artist_credit_name where artist=" + str(id) + ") as acn " \
                                "inner join release_group as rg on (acn.artist_credit = rg.artist_credit)" \
                                "where type !=4 and type !=5"
            cursor.execute(fSQL_getAlbumByID)
            for release,albumID in cursor:
                self.mRedisConn_Releases.sadd(re.sub(r'[^\s\w_]+', '', release).encode('UTF-8').upper(), name.encode("utf8"))
                self.mRedisConn_ReleaseIDs.set(re.sub(r'[\W]+', '', name + release).encode('UTF-8').upper(), albumID)

            fSQL_getWorksByID = "select w.id,CONVERT(w.name USING utf8) from (select entity1 from l_artist_work where entity0 = " + str(
                id) + \
                                ") as ent " \
                                "join work as w on (w.id=ent.entity1);"
            cursor.execute(fSQL_getWorksByID)
            for workID,work in cursor:
                self.mRedisConn_Work.sadd(re.sub(r'[^\s\w_]+', '', work).encode('UTF-8').upper(), name.encode('UTF-8'))
                self.mRedisConn_WorkIDs.set(re.sub(r'[\W]+', '', name+work).encode('UTF-8').upper(), workID)
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
                      prefix='Progress Building Username Redis: ', suffix='Complete', barLength=50)

        for id,name in nameArray:
            i += 1
            if i % 100 == 0:
                printProgress(i, numberOfArtists,
                              prefix='Progress Building Username Redis: ', suffix=str(i) + "/" + str(numberOfArtists),
                              barLength=50)

            fSQL_getTwitterUsername = "select url from " \
                                      "(select entity1 from l_artist_url where entity0 = " + str(id) + ") as e " \
                                      "join url on (url.id = e.entity1)" \
                                      "where url like '%twitter%'"

            cursor = self.mMySQLConn.cursor()
            cursor.execute(fSQL_getTwitterUsername)
            self.mRedisConn_Artist.set(name.encode('UTF-8').upper(),name)
            for twitter in cursor:
                username = "@" + twitter[0].split("/")[-1]
                # print("username:   \t", username, name, "\n")
                self.mRedisConn_Usernames.set(username.encode('UTF-8').upper(), id)

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
                      prefix='Progress Building Alias Redis: ', suffix='Complete', barLength=50)

        for id,name in nameArray:
            i += 1
            if i % 100 == 0:
                printProgress(i, numberOfArtists,
                              prefix='Progress Building Alias Redis: ', suffix=str(i) + "/" + str(numberOfArtists),
                              barLength=50)

            fSQL_getAliasByID = "select name from artist_alias where artist="+str(id)
            cursor.execute(fSQL_getAliasByID)
            for alias in cursor:
                # print("Alias:\t",alias[0].upper(), name.upper())
                self.mRedisConn_Alias.set(re.sub(r'[\W]+', '', alias[0]).encode('UTF-8').upper(), id)


    def initReleaseGroupREDIS(self):
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
                      prefix='Progress Building ReleaseGroup Redis: ', suffix='Complete', barLength=50)

        for id, name in nameArray:
            i += 1
            if i % 100 == 0:
                printProgress(i, numberOfArtists,
                              prefix='Progress Building ReleaseGroup Redis: ', suffix=str(i) + "/" + str(numberOfArtists), barLength=50)

            fSQL_getAlbumByID = "select name,rg.id from (select artist_credit, position " \
                                "from artist_credit_name where artist=" + str(id) + ") as acn " \
                                "inner join release_group as rg on (acn.artist_credit = rg.artist_credit)" \
                                "where type !=4 and type !=5"
            cursor.execute(fSQL_getAlbumByID)
            for release,albumID in cursor:
                # print("release:   \t",release.upper(), albumID,"\n")
                self.mRedisConn_Releases.sadd(re.sub(r'[^\s\w_]+', '', release).encode('UTF-8').upper(), name.encode("utf8"))

    def initWorkREDIS(self):
        """ Building a Redis index for quickly identifying Instances in Tweets. (May take a long time

        Returns:

        """
        fSQL = "select " \
               "a.name,w.name " \
               "from (Select name,id from artist) as a " \
               "join l_artist_work as lau on (a.id=lau.entity0) " \
               "join work as w on (w.id=lau.entity1) LIMIT 100;"

        #

        nameArray = []
        fSQL_GetNameAndID = "Select id,name from artist"
        cursor = self.mMySQLConn.cursor()
        cursor.execute(fSQL_GetNameAndID)
        nameArray = cursor.fetchall()
        numberOfArtists = len(nameArray)
        i = 0
        printProgress(i, numberOfArtists,
                      prefix='Progress Building Work Redis: ', suffix='Complete', barLength=50)

        for id, name in nameArray:
            i += 1
            if i % 100 == 0:
                printProgress(i, numberOfArtists,
                              prefix='Progress Building Work Redis: ',
                              suffix=str(i) + "/" + str(numberOfArtists), barLength=50)

            fSQL_getWorksByID = "select w.id,CONVERT(w.name USING utf8) from (select entity1 from l_artist_work where entity0 = " + str(id) + \
                   ") as ent " \
                   "join work as w on (w.id=ent.entity1);"
            cursor.execute(fSQL_getWorksByID)
            for workID,work in cursor:
                # print("work:   \t",work.upper(), workID)
                self.mRedisConn_Work.sadd(re.sub(r'[^\s\w_]+', '', work).encode('UTF-8').upper(), name.encode('UTF-8'))


    def initIDMapping(self):
        """ Building a Redis index for quickly identifying Instances in Tweets. (May take a long time

        Returns:

        """
        fSQL = "select " \
               "a.name,w.name " \
               "from (Select name,id from artist) as a " \
               "join l_artist_work as lau on (a.id=lau.entity0) " \
               "join work as w on (w.id=lau.entity1) LIMIT 100;"

        #

        nameArray = []
        fSQL_GetNameAndID = "Select id,name from artist"
        cursor = self.mMySQLConn.cursor()
        cursor.execute(fSQL_GetNameAndID)
        nameArray = cursor.fetchall()
        numberOfArtists = len(nameArray)
        i = 0
        printProgress(i, numberOfArtists,
                      prefix='Progress Building Work Redis: ', suffix='Complete', barLength=50)

        for id, name in nameArray:
            i += 1
            if i % 100 == 0:
                printProgress(i, numberOfArtists,
                              prefix='Progress Building Redis: ', suffix=str(i) + "/" + str(numberOfArtists), barLength=50)


            self.mRedisConn_ArtistIDs.set(re.sub(r'[\W]+', '', name).encode('UTF-8').upper(),id)


            fSQL_getAlbumByID = "select name,rg.id from (select artist_credit, position " \
                                "from artist_credit_name where artist=" + str(id) + ") as acn " \
                                "inner join release_group as rg on (acn.artist_credit = rg.artist_credit)" \
                                "where type !=4 and type !=5"
            cursor.execute(fSQL_getAlbumByID)
            for release,albumID in cursor:
                self.mRedisConn_ReleaseIDs.set(re.sub(r'[\W]+', '', name+release).encode('UTF-8').upper(), albumID)

            fSQL_getWorksByID = "select w.id,CONVERT(w.name USING utf8) from (select entity1 from l_artist_work where entity0 = " + str(
                id) + \
                                ") as ent " \
                                "join work as w on (w.id=ent.entity1);"
            cursor.execute(fSQL_getWorksByID)
            for workID,work in cursor:
                self.mRedisConn_WorkIDs.set(re.sub(r'[\W]+', '', name+work).encode('UTF-8').upper(), workID)



import sys
def main():

    poss= [ 'release', 'work', 'alias', 'username', 'all', 'id']
    if len(sys.argv) != 2 or not sys.argv[1] in poss:
        print("Wrong number of arguments")
        return

    RI = REDISinit()

    if sys.argv[1] == 'username':
        RI.initUsernameREDIS()
    if sys.argv[1] == 'alias':
        RI.initAliasREDIS()
    if sys.argv[1] == 'release':
        RI.initReleaseGroupREDIS()
    if sys.argv[1] == 'work':
        RI.initWorkREDIS()
    if sys.argv[1] == 'id':
        RI.initIDMapping()
    if sys.argv[1] == 'all':
        RI.initializeREDIS()


if __name__ == "__main__":
    main()
