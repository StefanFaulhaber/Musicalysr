import pluginmanager

class Listening(pluginmanager.IPlugin):
    def __init__(self):
        self.name = 'Listening'
        super().__init__()

    def getName(self):
        return self.name

    def getExtractions(self,tweetText):
        return {self.name: 0, "dict": 1, "of": 2, "Extractions": 3}