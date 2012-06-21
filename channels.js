/*
---

name: Channels

description: Mediate Class events. An expanded pattern for pub/sub.

license: MIT-style license.

copyright: Copyright (c) 2010 [Ryan Florence](http://ryanflorence.com/).

authors: Ryan Florence

inspiration:
  - dojo.publish [docs](http://docs.dojocampus.org/dojo/publish)

requires:
  - Core/Class.Extras

provides: [Channels]

...
*/

(function(){

var mediator = window,

	methods = {
		Implements: [Events],
		publishes: function(eventName, channel){
			if (typeOf(channel) === 'array'){
				channel.each(function(channel){ this.publishes(eventName, channel); }, this);
				return;
			}
			if(!window.hazTouch() && eventName.indexOf('touch') > -1) {
				console.log("Subscribe to : ", channel, " converted to mouse event for desktop event!");
				eventName = eventName.replace('touchstart', 'mousedown').replace('touchend', 'mouseup').replace('touchmove', 'mousemove');
			}
			for(var i in Channels.publishing) {
				if(Channels.publishing[i].channel == channel && Channels.publishing[i].event == eventName) {
					return;
				}
			}
			Channels.publishing.push({publisher: this, channel: channel, event: eventName});
			this.addEvent(eventName, function(evt){
			    mediator.fireEvent.call(mediator, channel, arguments);		
			});
			return this;
		}.overloadSetter(), // not public MooTools

		subscribe: function(channel, fn){
			try {
				fn = typeof(fn) == 'string' && this[fn] ? this[fn].bind(this) : fn.bind(this);			
			} catch (E) {
				console.error("Could not subscribe to channel : " + channel + "  for  ", fn);
			}			
			Channels.subscriptions.push({subscriber: this, channel: channel, func: fn });
			
			mediator.addEvent(channel, fn);
			return this;
		}.overloadSetter()
	},

Channels = this.Channels = new Class(methods);

Object.append(Channels, {
	publishing: [],
	subscriptions: [],
	
	remove: function(channel){
		mediator.removeEvents(channel);
		Channels.publishing = Channels.publishing.filter(function(item){ 
			return item.channel != channel;
		});
	},
	removeMine: function(whose) {
		console.log("Removing my channels! ", whose, this, Channels);
		Channels.subscriptions = Channels.subscriptions.filter(function(item){ 
			return item.subscriber!= whose;
		});
	},
	installTo: function(obj){
		if (typeOf(obj) === 'array'){
			obj.each(function(item){ Channels.installTo(item); }, this);
			return;
		}
		obj.implement(methods);
	},

	
});

})();

Class.Mutators.PubSub = function(pubsubs){
	if (!this.prototype.initialize) this.implement('initialize', function(){});
	return pubsubs;
};

Class.Mutators.initialize = function(initialize){
	return function(){
	
		if (this.PubSub) {
			if(this.PubSub.publish) {
				$H(this.PubSub.publish).each(function(evts, selector) {
				var target = $$(selector);
					if(typeof evts == "object") {
						$H(evts).each(function(func,evt) {
							target.publishes(evt, func);
						});
					} else {
						this.publishes(this.PubSub.publish);	
					}
				});
			}
			if(this.PubSub.subscribe) this.subscribe(this.PubSub.subscribe);
		}
		return initialize.apply(this, arguments);
	};
};

Channels.installTo(Element);

Element.implement({
	show:function() {
		this.removeClass('hidden').addClass('visibile');
	},
	hide: function() {
		this.removeClass("visibile").addClass('hidden');
	}
});

window.hazTouch = function() {
	if(!this.result) {
		try {
			document.createEvent('TouchEvent').initTouchEvent('touchstart');
			this.result = true;
		} catch (exception){ this.result = false; }
	}
	return this.result;
}