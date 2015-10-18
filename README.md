# meteor-shortener		
A simple URL shortener built using Meteor.		
		
### Notes:  		
1) POST data must be sent as x-www-form-urlencoded  		
2) It accepts requests only from origin matching RECEIVE_DOMAIN environment variable  		
3) POST to /new with key=RECEIVE_KEY and url=URL for a link  		
4) POST to /stats with key=RECEIVE_KEY and slug=xxxxx (shortened url extension) for stats        		
5) POST to /delete with key=RECEIVE_KEY and slug=xxxxx to delete a link  		
5) All POST responses are returned as JSON objects  		
6) When accessing site directly, or when a link isn’t found, it redirects to REDIRECT_URL        		
7) There is no URL validation in this code  		
 Lock conversation
