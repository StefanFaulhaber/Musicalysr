
##Setup up redis:

 1. Stop the redis service
 2. put the dump.rdb file in the right directory (/var/lib/redis/)
 3. Start up redis

 So far only db 1 and 2 contain data.

 After that, you can call Aggregation.py and it will connect to the socket 2049 opened by the twitter stream server


 output:

 	{	timestamp: ...
 		frequencies: { "id1" : 1

 		 },

 		coocurences :{ 

	 		"id1" : { 
	 			"id2" : 1,
	 			"id5" : 2

	 	    },
	 	    "id2" : {
	 	    	"id1" : 1,
	 	    	"id3" : 2
	 	    	...
	 	}

 	}

 }

 Timestamp is in sql datetime format and can be inserted