var oauth = {
	facebook: {
	 clientID: '1450273658559319',
	 clientSecret: '34383b91714a2ae2ed3b4f96ff83d2f9',
	 callbackURL: 'http://localhost:9000/auth/facebook/callback'
	},
	twitter: {
	 consumerKey: 'KprQuh4KG8iudu7eB1sAmSqIV',
	 consumerSecret: 'eBmovpPhgqG7245n2ZQ7FfpvGbM9qWy7vFiOwJGMeOi3AesCWr',
	 callbackURL: "http://localhost:9000/auth/twitter/callback"
	},
	github: {
	 clientID: 'get_your_own',
	 clientSecret: 'get_your_own',
	 callbackURL: "http://localhost:9000/auth/github/callback"
	},
	google: {
	 returnURL: 'http://localhost:9000/auth/google/callback',
	 realm: 'http://localhost:9000'
	},
	openid: {
	 returnURL: 'http://localhost:9000/auth/openid/return',
	 realm: 'http://localhost:9000'
	}
}

module.exports = oauth
