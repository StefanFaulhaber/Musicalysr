# -*- coding: utf-8 -*-

"""Tweet Processing Module

This Module analyses tweets on at a time and extracts entities matching a database

Example:
    python TweetNLP.py "<Tweetdatabase>"

Todo:
    * Implement a function for the main function
    * Implement Candidate list Extraction
    * Additional Test for Hashtags as Entities
    * Maybe near matches by spell checking (?)


"""


from nltk import TweetTokenizer
from nltk import ngrams

from Configuration import Configuration
from EntityMatchingREDIS import EntitySets

import logging
import sys


class Tweet:
    """Class for Holding and Analysing single Tweets

        This class analyses on Tweet at a Time with the use of Keyword extraction, Hashtag Extraction,
        Username Extraction and Entitymatching with regards to the baseline database

        Attributes:
            mTweet (str): Containing the raw String format of the Tweet
            mHashtags (list): Containing the Hashtags
            mAssociatedUsers (list): Containing the Usernames mentioned in the Tweet
            mExtractedGoods (list): The finally extracted entities

    """

    mTweet = str                 # Tweet in raw form
    mHashtags = []               # contained Hashtags from Twitter
    mAssociatedUsers = []        # Mentioned users from Twitter
    mEntityMatcher = EntitySets  # An Entitity Matcher Instance to Match de Candidates to the Database

    mCandidateList = []
    mNGrams = set()
    mLogger = logging.Logger

    mExtractedGoods = []         # The extracted Entities

    def __init__(self):
        """Initialize the Instance.

            This initialization is also initializing the EntitySet member. Reading the Lists of Instances to memory
            may take a few seconds
        """
        logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
        self.mLogger = logging.getLogger("TweetNLP")
        self.mEntityMatcher = EntitySets()
        self.mLogger.setLevel(logging.WARN)
        self.mLogger.info("Initialization of Tweet completed.")

    def reset(self):
        """Resetting all members

              Emptying all the member Variables for clean next round
          """
        self.mTweet = ""
        self.mHashtags = []
        self.mAssociatedUsers = []
        self.mNGrams = set()
        self.mCandidateList = []
        self.mExtractedGoods = []

    def setTweet(self, fTweet={}):
        """Setting a new Tweet

            Argument is a Tweet in JSON. This is internally parsed and saved to the member variables

        Args:
            self:
            fTweet: Tweet in JSON Format

        Returns:
            Nothing
        """
        self.reset()
        self.mTweet = fTweet["text"].lower().replace("&amp;", "and").replace("&amp ;", "and").replace("&", "and")
        try:
            for url in fTweet["entities"]["urls"]:
                self.mTweet = self.mTweet.replace(url["url"].lower(), " ")
        except IndexError:
            pass
        self.mHashtags = []
        for hashtag in fTweet["entities"]["hashtags"]:
            self.mHashtags.append(hashtag["text"].lower())
            self.mTweet = self.mTweet.replace("#"+hashtag["text"].lower(), hashtag["text"].lower())

        try:
            for user in fTweet["entities"]["user_mentions"]:
                self.mAssociatedUsers.append("@"+user["screen_name"])
        except:
            pass

        self.mTweet = self.mTweet.lower().replace("&amp;", "and").replace("&amp ;", "and").replace("&", "and")

    def extract(self):
        """

        Args:
            self:


        Returns: string if labelled 'relevant' or labelled 'unlabelled'

        Todo:
            * Add more Filtering options for the Candidate list depending on the Branch
            * return boolean if there were instances extracted


        """
        # Username Branch
        fRecognizedUsers = self.mEntityMatcher.recognizeUsername(self.mAssociatedUsers)
        if fRecognizedUsers:
            self.mLogger.info("Username Branch")
            self.mExtractedGoods += list(fRecognizedUsers)
            # fC = self.getCandidateList()
            # ToDo:  Further Filtering of the List with regards to the Username(s) found
            #
            # self.mExtractedGoods += list(fC.keys())
            # return "relevant"
        #
        # Look for known Artists as Hastags by searching an alias List
        fRecognizedUsersInHashtags = self.mEntityMatcher.recognizeAlias(self.mHashtags)
        if fRecognizedUsersInHashtags:
            self.mLogger.info("Users in Hashtag Branch")
            self.mExtractedGoods += list(fRecognizedUsersInHashtags)

         # if bool(set(self.mHashtags) & set(Configuration.mMusicCategorizationHashtagList)):
        #     self.mLogger.info("Hashtag Branch")
        #     fC = self.getCandidateList()
        #     self.mLogger.debug(fC)
        #     # ToDo: Further Filtering of the List with regards to the extracted Entities themselves,
        #     # ToDo: Maybe special Treatment for known Hashtags (#NowPlaying)

        return "unlabelled"

    def getExtractedGoods(self):
        """
            Getter for the list of the extracted Entities
        Returns:    List of extracted Entities

        """
        return self.mExtractedGoods

    def getCandidateList(self):
        """ Compile a Candidatelist for the current Tweet of possible instances.

        Returns:    List of of nGrams that had a match in the Database

        """
        self.nGramGenerator()
        candidates = dict()
        for ngram in self.mNGrams:
            found = self.mEntityMatcher.recognize(ngram)
            if found != "Null":
                candidates[ngram] = found

        # Filter longest Matches
        filteredCandidates = {}
        for cand, label in candidates.items():
            if not any(cand in s for s, l in candidates.items() if s != cand):
                filteredCandidates[cand] = label

        return filteredCandidates

    def nGramGenerator(self):
        """
            Generating nGrams of the Tweet for Matching with the Entity List
        Returns: NULL

        """
        tknzr = TweetTokenizer()
        token = tknzr.tokenize(self.mTweet.replace("/", " ").replace("-", " ").replace(":", " "))
        for i in range(Configuration.mSizeOfNGramsForMatching):
            self.mNGrams |= set([' '.join(ngram) for ngram in list(ngrams(token, i + 1))])

        self.mNGrams = set([x.strip(" ,.") for x in self.mNGrams])
        self.mNGrams = set([x.strip(" ,.") for x in self.mNGrams if len(x) > 1])