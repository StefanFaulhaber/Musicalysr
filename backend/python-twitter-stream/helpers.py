# -*- coding: <UTF-8> -*-
# Print iterations progress
import sys
from collections import Counter
from time import strptime
import datetime

def printProgress(iteration, total, prefix='', suffix='', decimals=1, barLength=100):
    """
    Call in a loop to create terminal progress bar
    @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : positive number of decimals in percent complete (Int)
        barLength   - Optional  : character length of bar (Int)
    """
    formatStr = "{0:." + str(decimals) + "f}"
    percents = formatStr.format(100 * (iteration / float(total)))
    filledLength = int(round(barLength * iteration / float(total)))
    bar = '+' * filledLength + '-' * (barLength - filledLength)
    sys.stdout.write('\r%s |%s| %s%s %s' % (prefix, bar, percents, '%', suffix)),
    if iteration == total:
        sys.stdout.write('\n')
    sys.stdout.flush()



def generateCoocurenceJSON( c = Counter ):
    """

    :param c: Counter with a pair of Stringsd as key
    :return:  JSON like Dictionary With all ordered Coocurences
    """
    jsonCoocurences = {}

    for elem in c.keys():

        if elem[0] not in jsonCoocurences:
            jsonCoocurences[elem[0]] ={}
        jsonCoocurences[elem[0]][elem[1]] = int(c[elem])
        if elem[1] not in jsonCoocurences:
            jsonCoocurences[elem[1]] ={}
        jsonCoocurences[elem[1]][elem[0]] = int(c[elem])

    return jsonCoocurences


def convert(data):
  if isinstance(data, bytes):      return data.decode()
  if isinstance(data, (str, int)): return str(data)
  if isinstance(data, dict):       return dict(map(convert, data.items()))
  if isinstance(data, tuple):      return tuple(map(convert, data))
  if isinstance(data, list):       return list(map(convert, data))
  if isinstance(data, set):        return set(map(convert, data))


def createRoundedTimestamp(timestring):
    """
    Creates a SQL format Timestamp rounded to the next nearest quarter of an hour
    :param timestring:
    :return:
    """
    if timestring == "":
        return ""

    tmp = timestring.split(".")[0].replace("-",":").replace("T",":").split(":")

    if int(tmp[4]) % 15 == 0: # Dont round to the next quarter
        minutes = tmp[4]
    else:
        minutes = str(15 + 15 * int(int(tmp[4])/15)) #round to the next quarter

    #if necessary convert full hour
    if minutes == "60":
        tmp[3]=str(int(tmp[3])+1)
        minutes="00"

    timeSQLFormat = tmp [0]+"-"+tmp[1]+"-"+tmp[2]+" "+tmp[3]+":"+minutes
    return timeSQLFormat

