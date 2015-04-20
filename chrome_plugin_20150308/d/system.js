var system = {
	ready : false;
	settins : {},
	context_menu : {},
	handler : {},

	init : function (settings) {
		this.settings = settings;
		this.settings.init();
		this.context_menu.init();
		this.handler.init();
		this.ready = true;
	},

	event : ['grap', 'dump'],

	map : function (event) {
		
		return this[event];
	},
	
	

	dump : function (data) {

		return {
			settings : this.settings,
			res : this.resource
		};
	},
	grab : function (data) {}

}
