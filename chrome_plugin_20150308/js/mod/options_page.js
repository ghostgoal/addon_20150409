var ui = {
	ids : [''],
	init : function () {},
	load : function () {},
	save : function () {}

};
var test = {
	init : function () {
		var mod = MODULE_MAPS[0];
		MODULE.INIT(this, mod.id, mod.name, mod.desc, mod.events);
	},
	settings : {}; ,
	reset_settings : function () {
		this.fire('rest', '', this.on_reset_settings);
	},
	on_reset_settings : function (settings) {
		test.settings = settings;
	},
	load_settings : function () {
		this.fire('load', '', this.on_load_settings);
	},
	on_load_settings : function (settings) {
		test.settings = settings;
	},
	save_settings = function (settings) {
		this.fire('save', this.settings, this.on_save_settings);
	},
	on_save_settings : function () {
		alert("±£´æ³É¹¦£¡");
	}
};
test.init();
