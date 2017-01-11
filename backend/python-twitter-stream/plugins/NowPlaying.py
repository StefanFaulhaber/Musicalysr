import pluginmanager
from nltk import TweetTokenizer
from nltk import ngrams
from Configuration import Configuration
from EntityMatchingREDIS import EntitySets
import re

class NowPlaying(pluginmanager.IPlugin):
    mTweet = ""
    mNGrams = set()
    mEntityMatcher = EntitySets

    def __init__(self):
        self.mEntityMatcher = EntitySets()
        self.name = 'NowPlaying'
        super().__init__()


    def getName(self):
        return self.name

    def getExtractions(self,tweetText):
        # print("NowPlaying")

        self.mTweet = tweetText.encode("utf-8").decode('utf-8','ignore').replace("#NOWPLAYING","")
        self.mTweet = re.sub(r'&amp', '', self.mTweet)
        self.mTweet = ''.join(c for c in self.mTweet if c.isalnum() or c in ["'", "#", "*", " "] )
        self.mTweet = re.sub(r'[^\s\w_]+', '', self.mTweet)

        # print(self.mTweet)
        self.mNGrams = set()
        return self.getCandidateList()

    def getCandidateList(self):
        """ Compile a Candidatelist for the current Tweet of possible instances.

        Returns:    List of of nGrams that had a match in the Database

        """
        self.nGramGenerator()
        candidates = list()
        # print(self.mNGrams)

        candidatesWork,candidatesWordDict = self.mEntityMatcher.recognizeWork(self.mNGrams)

        filteredCandidates = []
        filteredCandidatesDict = {}
        for cand in candidatesWork:
            if not any(cand.upper() in s.upper() for s in candidatesWork if s.upper() != cand.upper()):
                filteredCandidates += [cand]
                filteredCandidatesDict[cand] = candidatesWordDict[cand]
        candidatesWork = filteredCandidates
        candidatesWorkDict = filteredCandidatesDict

        candidatesArtist = self.mEntityMatcher.recognizeArtists(self.mNGrams)
        candidatesArtist += self.mEntityMatcher.recognizeAlias(self.mNGrams)
        candidatesArtist += self.mEntityMatcher.recognizeUsername(self.mNGrams)
        filteredCandidates = []
        for cand in candidatesArtist:
            if not any(cand.upper() in s.upper() for s in candidatesArtist if s.upper() != cand.upper()):
                filteredCandidates += [cand]
        candidatesArtist = filteredCandidates

        candidatesRelease, candidatesReleaseDict = self.mEntityMatcher.recognizeRelease(self.mNGrams)
        filteredCandidates = []
        filteredCandidatesDict = {}
        for cand in candidatesRelease:
            if not any(cand.upper() in s.upper() for s in candidatesRelease if s.upper() != cand.upper()):
                filteredCandidates += [cand]
                filteredCandidatesDict[cand] = candidatesReleaseDict[cand]
        candidatesRelease = filteredCandidates
        candidatesReleaseDict = filteredCandidatesDict
        # print("Works: ",candidatesWork)
        # print("Artists: ",candidatesArtist)
        # print("Releases: ",candidatesRelease)

        #Look for connected Releases or works with artists
        output = []
        for key in list(candidatesWorkDict.keys()):
            partSet = candidatesWordDict[key]
            matchingArtist = set()
            matchingArtist= partSet & set(candidatesArtist)

            if len(matchingArtist) == 1 and list(matchingArtist)[0].upper() != key.upper():
                artist = matchingArtist.pop()
                artistID = self.mEntityMatcher.getID("artist", artist)
                workID = self.mEntityMatcher.getID("work", artist+key)
                output+=[(artistID, "artist")]
                output+=[(workID , "work" )]
                break


        for key in list(candidatesReleaseDict.keys()):
            partSet = candidatesReleaseDict[key]
            matchingArtist = set()
            matchingArtist = partSet & set(candidatesArtist)

            if len(matchingArtist) != 0 and list(matchingArtist)[0].upper() != key.upper()  :
                artist = matchingArtist.pop()
                artistID = self.mEntityMatcher.getID("artist", artist)
                releaseID = self.mEntityMatcher.getID("release", artist+key)
                output+=[(artistID, "artist")]
                output+=[(releaseID , "release" )]


        # print(list(set(output)))


        return list(set(output))

    def nGramGenerator(self):
        """
            Generating nGrams of the Tweet for Matching with the Entity List
        Returns: NULL

        """
        tknzr = TweetTokenizer()
        token = tknzr.tokenize(self.mTweet.replace("/", " ").replace(":", " "))
        for i in range(Configuration.mSizeOfNGramsForMatching):
            self.mNGrams |= set([' '.join(ngram) for ngram in list(ngrams(token, i + 1))])

        # self.mNGrams = set([x.strip(" ,.") for x in self.mNGrams])
        # self.mNGrams = set([x.strip(" ,.") for x in self.mNGrams if len(x) > 1])
        # self.mNGrams = set([x.strip(" ,.") for x in self.mNGrams if "-" not in x])

        #self.mNGrams = set ([re.sub(r'[^\s\w_]+', '', x) for x in self.mNGrams])