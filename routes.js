Router.route('main', {
    path: '/',
	where: 'server',
    action: function() {
		this.response.writeHead(302, {
		    'Location': process.env.REDIRECT_URL
		});
		this.response.end();
    }
});

Router.route('/new', function() {
	if(this.request.headers.origin === process.env.RECEIVE_DOMAIN) {
		if(this.request.body.key == process.env.RECEIVE_KEY) {
			var theURL = this.request.body.url;
			if(theURL.substring(0, 8) !== "https://") {
				if(theURL.substring(0, 7) === "http://") {
					theURL = "https://" + theURL.substring(7);
				} else {
					theURL = "https://" + theURL;
				}
			}
			var linkExists = Links.findOne({
				url: theURL
			});
			if(linkExists) {
				var obj = new Object();
				obj.url = process.env.CURRENT_URL + linkExists.slug;
			    obj.key  = process.env.RETURN_KEY;
			    var JSONString = JSON.stringify(obj);
				this.response.end(JSONString);
				return true;
			}
			var taken = true;
			while(taken) {
				var slug = Math.random().toString(36).substring(13);
				var slugExists = Links.findOne({
					slug: slug
				});
				if(!slugExists) {
					taken = false;
				}
			}
			var noError = false;
			Links.insert({
				slug: slug,
				url: theURL,
				views: 0,
				created: new Date().getTime()
			}, function(error, id) {
				noError = error;
			});
			if(!noError) {
				var obj = new Object();
				obj.url = process.env.CURRENT_URL + slug;
			    obj.key  = process.env.RETURN_KEY;
			    var JSONString = JSON.stringify(obj);
				this.response.end(JSONString);
				return true;
			} else {
				var obj = new Object();
				obj.error = noError;
			    var JSONString = JSON.stringify(obj);
				this.response.end(JSONString);
				return false;
			}
		} else {
			var obj = new Object();
			obj.error = "Invalid key.";
		    var JSONString = JSON.stringify(obj);
			this.response.end(JSONString);
			return false;
		}
	} else {
		var obj = new Object();
		obj.error = "Invalid domain.";
	    var JSONString = JSON.stringify(obj);
		this.response.end(JSONString);
		return false;
	}
}, {where: 'server'});

Router.route('/stats', function() {
	if(this.request.body.key == process.env.RECEIVE_KEY) {
		var link = Links.findOne({
			slug: this.request.body.slug
		});
		if(link) {
			var obj = new Object();
			obj.stats = new Object();
			obj.stats.url = link.url;
			obj.stats.views = link.views;
			obj.stats.created = link.created;
		    obj.key = process.env.RETURN_KEY;
		    var JSONString = JSON.stringify(obj);
			this.response.end(JSONString);
			return true;
		} else {
			var obj = new Object();
			obj.error = "No link found.";
		    var JSONString = JSON.stringify(obj);
			this.response.end(JSONString);
			return true;
		}
	} else {
		var obj = new Object();
		obj.error = "Invalid key.";
	    var JSONString = JSON.stringify(obj);
		this.response.end(JSONString);
		return false;
	}
}, {where: 'server'});

Router.route('/delete', function() {
	if(this.request.body.key == process.env.RECEIVE_KEY) {
		Links.remove({
			slug: this.request.body.slug
		});
		var obj = new Object();
		obj.success = true;
	    obj.key = process.env.RETURN_KEY;
	    var JSONString = JSON.stringify(obj);
		this.response.end(JSONString);
		return true;
	} else {
		var obj = new Object();
		obj.error = "Invalid key.";
	    var JSONString = JSON.stringify(obj);
		this.response.end(JSONString);
		return false;
	}
}, {where: 'server'});

Router.route('slug', {
    path: '/:slug',
	where: 'server',
    waitOn: function() {
        return Meteor.subscribe('links');
    },
    action: function() {
		var time = new Date().getTime();
		var link = Links.findOne({
			slug: this.params.slug
		});
		if(link) {
			Links.update({
				slug: this.params.slug
			}, {
				$inc: { views: 1 }
			});
			this.response.writeHead(302, {
			    'Location': link.url
			});
			this.response.end();
		} else {
			this.response.writeHead(302, {
			    'Location': process.env.REDIRECT_URL
			});
			this.response.end();
		}
    }
});