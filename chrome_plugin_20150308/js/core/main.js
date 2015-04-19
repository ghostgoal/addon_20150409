var system = {
	TAG:'system',
	res : [],
	settings:{},

	init : function () {

		/* for (var i = 0; i < RESOURCE_IDS.length; i++) {
			res[i] = {};
			RESOURCE.INIT(res[i], RESOURCE_IDS[i], {});
		}

		
		EVENTHANDLER.INIT('options', 'save', this.save); */
		RESOURCE.INIT(this.settings,RESOURCE_ID[0],RESOURCE_DEFAULT[0]);
		
		EVENTPUMP.ATTACH(this);
		EVENTHANDLER.INIT(this,'op', 'save', this.on_test_save);
		
		EVENTHANDLER.INIT(this,'op', 'load', this.on_test_load);
		EVENTHANDLER.INIT(this,'op', 'reset', this.on_test_reset);
		EVENTPUMP.LOOP();

	},
	on_cs_load:function (data,cb)
	{
		DEBUG.LOG(this,'on_cs)_load');
	}
	
	,
	on_test_save : function (data, cb) {
		
			this.settings.save(data);
	  cb(this.settings.cur);
		
	},
	on_test_load : function (data, cb) {
				this.settings.load();
	  cb(this.settings.cur);
	},
	on_test_reset : function (data, cb) {
				this.settings.reset();
	  cb(this.settings.cur);
	}

}

system.init();
