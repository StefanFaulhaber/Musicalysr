from _hashlib import HASH

from pluginmanager import PluginInterface, plugin_interface





class HashtagPlugins:
    plugin_interface = PluginInterface
    plugins = list
    pluginNames = []



    def __init__(self):
        self.plugins = []
        self.pluginNames = []


        try:
            self.plugin_interface = PluginInterface()
        except ValueError:
            print("Caught")

        self.plugin_interface.set_plugin_directories("plugins/")
        try:
            self.plugin_interface.collect_plugins()
        except ValueError:
            print("Caught")

        try:
            self.plugins = self.plugin_interface.get_instances()
        except ValueError:
            print("Caught")


        for p in self.plugins:
            self.pluginNames.append(p.getName().upper())
        print(self.pluginNames)


    def extract( self,  hashtags ,tweetText ):
        for ht in hashtags:
            for pl in self.plugins:
                if ht.upper() == pl.getName().upper():
                    return pl.getExtractions(tweetText)

        return []


if __name__ == "__main__":
    HP = HashtagPlugins()
    print(HP.extract(["NowPlaying"],"tweetText" ))