ProjectMaya = new Class({

	Implements: [Events, Options, Channels],

	PubSub: {
		subscribe: { 
			'/tile/activate'	: 'activateTile'
		},
		publish: {
			'#app' : {
				'touchstart:relay(#actionpicker .tiles .tile:not(.disabled):not(.inverted))' : '/tile/activate'
			}
		}
	},

	activeTile: false,
	
	initialize: function() {
		console.log("Project Maya initted.");
		$('app').removeClass('loading').addClass('loaded');
		this.tiles = $$('.tiles .tile');
		
		this.db = new Db(this);
		var tilesContainer = $('actionpicker').getFirst('.tiles');

		this.db.getSoundsForPage('Home', function(sounds) {
			console.log("Found sound: ", sounds);
			for(var i=0; i< sounds.rows.length; i++) {
				console.log(sounds.rows.item(i));
				var sound = sounds.rows.item(i);
				new Element('div.wrapper').adopt(
					new Element('div.tile', { 'data-wavefile': sound.phrase }).adopt(
						new Element('p', { text: sound.label }),
						new Element('a.sprite').adopt(
							new Element('span.'+sound.icon)
							)
						)
					).inject(tilesContainer);
			}
			this.showPage('actionpicker');
		}.bind(this), function() {
			
			this.showPage('databasesetup');

			new Request({
				url: './db.sqlite.sql',
				onComplete: function(response) {
					$("query").set('text', "Filling default database");
					var queries = response.split(";\n");
					this.db.processImport(0, queries, function() {
						this.db.getSoundsForPage('Home', function(sounds) {
							console.log("Found sound: ", sounds);
							for(var i=0; i< sounds.rows.length; i++) {
								console.log(sounds.rows.item(i));
								var sound = sounds.rows.item(i);
								new Element('div.wrapper').adopt(
									new Element('div.tile', { 'data-wavefile': sound.phrase }).adopt(
										new Element('p', { text: sound.label }),
										new Element('a.sprite').adopt(
											new Element('span.'+sound.icon)
											)
										)
									).inject(tilesContainer);
							}
							this.showPage('actionpicker');
						}.bind(this), function(err) { alert(err.message); });
					}.bind(this));

				}.bind(this)
			}).send();
			
		}.bind(this));

		
	},

	showPage: function(page) {
		console.log("Showing page: ", page);
		$$(".page").removeClass('visible');
		$(page).addClass('visible');
	},


	activateTile: function(evt) {
		
		var target = evt.target.hasClass('tile') ? evt.target : evt.target.getParent('.tile');
		
		if(target.hasClass('inverted')) {
			target.removeClass('inverted');
		} else {
			this.playSound(target.get('data-wavefile'));
			target.addClass('inverted');
		}	
		
	},

	playSound: function(name) {
		var a = new Element('audio', { 'data-id': name,  src: 'audio/'+name+'.wav'}).inject(document.body).play();
		
	},


   /**
    * Shuffle the actual DOM order of these elements.
	*/
	rearrangeDOM: function(elements, parent, newOrder){
		var rearranged = [];
		var parent = $(parent);
		newOrder.each(function(index){    //move each element and store the new default order
			if(elements[index]) {
			rearranged.push(elements[index].inject(parent));
			}
		}, this);
		elements = $$(rearranged);
	}


});



Db = new Class({
	Implements: [Options, Events, Channels],

	initialize: function(parent) {
		this.parent = parent;
		this.db = window.openDatabase("db", "1.01", "db", 2200000);
		this.sessionID = new Date().getTime() / 1000;
	},
	

	query: function(query, parameters, oncomplete, onerror) {
		if(!onerror) onerror = this.onError;
		this.db.transaction(function(conn) {
			conn.executeSql(query, parameters, function(tx, result) {

				if(result.rows.length == 1) {
					oncomplete(result.rows.item(0));
				} else {
					oncomplete(result);
				}
			}, onerror);
		});
	},

	processImport: function(i, queries, complete) {
		if(i < queries.length) {
			$("query").set('html', queries[i]);
			this.query(queries[i]+';', [],	function(tx, result) {
				this.processImport(i +1, queries,complete);
			}.bind(this),					function(err) {
				console.log("Query error in ", queries[i], err.message);
				this.processImport(i +1, queries, complete);
			}.bind(this));
		} else {
			$('query').set('text', 'done');
			complete();
		}
	},

	getSound: function(sound, complete, error) {
		this.query("select base64wave from audio where phrase = ?", [sound], complete, error);
	},

	getSoundsForPage: function(page, complete, error) {
		this.query("select icon, background, sort_index, label, phrase from audio left join page on audio.ID_Page = page.ID_Page where page.Title = ? order by audio.sort_index", [page], complete, error);
	}

});

