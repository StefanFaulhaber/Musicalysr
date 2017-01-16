
##Setup up redis:

 1. Stop the redis service
 2. put the dump.rdb file in the right directory (/var/lib/redis/)
 3. Start up redis

 So far only db 1 and 2 contain data.

 After that, you can call Aggregation.py and it will connect to the socket 2049 opened by the twitter stream server


##JSON-Format
'''
{
	time: "YYYY-MM-DD hh:mm",   	# Timestamp in mysql format. already rounded UP to quarters
	numberOfTweets: "N", 				# N Tweets were read in this intervall

	frequencies : {        				# Frequencies of single entities over all tweets

			#Frequency n followed by all entities that occured n times as [id, type]

			"1" : [["439110", "artist"], ["64144", "artist"], ["175635", "artist"], ["1054868", "artist"]],

			"3" : [...]

	},
	cooccurences : {

		work : {

			"230498" : {
				"1" : [...]
				"5" : [...]
			}
			"39423" ...

		},
		artist : {....},
		release : {....}
	}
}
'''
