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
from itertools import chain
import requests

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

        if fExtraction:
            fAllExtractions.append(fExtraction)
            fCooccurences += list(itertools.combinations(set(fExtraction), 2))

    fdist1 = Counter(list(chain.from_iterable(fAllExtractions)))
    fdistList = []
    for key in fdist1.keys():
        inst = {}
        if isinstance(str(key[0]), bytes):
            print("This is a Byte String: ",str(key[0])) 

        inst["id"] = key[0]
        inst["type"] = key[1].encode('utf-8').decode('utf-8')
        inst["count"] = str(fdist1[key]).encode('utf-8').decode('utf-8')
        fdistList.append (inst)


    fdist2 = Counter(fCooccurences)


    return fdistList, helpers.generateCoocurenceJSONNew(helpers.convert(fdist2))


def process(*args):
    """
        Callback function for the analysis of tweets
    :param args:
    :return:
    """
    tweetArray = json.loads(json.dumps(args[0]))
    numOfTweets = len(tweetArray['data'])
    f1,f2 = aggregatedExtractions(tweetArray['data'])

    jsonObjDictionary = {}
    jsonObjDictionary["timeStamp"] = helpers.createRoundedTimestamp(tweetArray["timeStamp"])
    jsonObjDictionary["frequencies"] = f1
    jsonObjDictionary["cooccurences"] = f2
    jsonObjDictionary["numberOfTweets"] = numOfTweets

    print(jsonObjDictionary, "\n")

    try:
        r = requests.post(Configuration.mDatabaseEndpointURL, json=jsonObjDictionary)
    except requests.exceptions.ConnectionError:
        print("No connection. You should check that.")


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
