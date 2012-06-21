HistoryManager = new Class({
	
	Implements: [Options, Events, Channels],
	
	PubSub: {
		subscribe: {
			'/state/change': 'saveState'
		}
	},

	initialize: function(starthash) {
		window.addEventListener('hashchange', this.changeHash.bind(this), false, false);
		if(starthash) this.changeHash.delay(1500, this, [starthash]);
	},

	changeHash: function(start) {
		var hash = start || window.location.hash;
		if(hash.length > 1) {

			var splits = hash.substr(0,2) == '#/' ? hash.substr(2).split('/') : hash.substr(1).split('/');
			console.log("changeHash! "+ splits.join('/'));
			var newHash = '/'+splits.splice(0,2).join('/');
			window.fireEvent(newHash, splits);
		}
	},

	setHash: function(state) {
		console.debug("Set State! " + state);
		window.location.hash = '#'+state;
	}
});