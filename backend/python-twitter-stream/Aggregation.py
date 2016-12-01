#!/bin/python
# -*- coding: UTF-8 -*-
from TweetNLP import Tweet
from nltk import FreqDist
import itertools
import json
from socketIO_client import SocketIO
import logging
from collections import Counter
import helpers
from Configuration import Configuration

def aggregatedExtractions(aTweetArray=[]):
    """
        Introduces a Loop to Agregate the results of a batch of tweets

        Returns: A dictionary of results. Key => Entities , Values => Number of Occurences
    """
    fTweet = Tweet()
    fAgregatedResults = dict()
    fAllExtractions = []
    fCooccurences = []

    for tweet in aTweetArray:
        fTweet.setTweet(tweet)
        fTweet.extract()

        fExtraction = set(fTweet.getExtractedGoods())
        fAllExtractions += list(fExtraction)
        for elem in fExtraction:
            fAgregatedResults[elem] = fAgregatedResults.get(elem, 0)+1

        fCooccurences += list(itertools.combinations(fExtraction, 2))

    fdist1 = Counter(fAllExtractions)
    fdist2 = Counter(fCooccurences)

    return dict(fdist1), helpers.generateCoocurenceJSON(helpers.convert(fdist2))


def process(*args):
    """
        Callback function for the analysis of tweets
    :param args:
    :return:
    """
    tweetArray = json.loads(json.dumps(args[0]))
    f1,f2 = aggregatedExtractions(tweetArray['data'])
    # print(f1,"\n",f2)

    jsonObjDictionary = {}
    jsonObjDictionary["time"] = helpers.createRoundedTimestamp(tweetArray["timeStamp"])
    jsonObjDictionary["frequencies"] = f1
    jsonObjDictionary["coocurences"] = f2

    print(json.dumps(jsonObjDictionary),"\n")
    # js = json.loads(j)
    # print(j['data'][0]['entities']['hashtags'])

def main():
    """
    Connecting to a server Socket and call a function to

    """
    logging.getLogger('socketIO-client').setLevel(logging.WARN)
    logging.basicConfig()

    with SocketIO(Configuration.mStreamingHost, Configuration.mStreamingPort) as socketIO:
        socketIO.on('tweet', process)
        socketIO.wait()

if __name__ == "__main__":
    main()
