var DEBUG = {
	TAG : '',
	enable : true; ,
	init : function (tag) {
		this.TAG = tag || 'DEBUG';

	},
	LOG : function (log) {
		if (this.enable) {
			alert(log);
		}
	},
	ERROR : function (error) {
		if (this.enable) {
			alert(error);
		}
	}

}
