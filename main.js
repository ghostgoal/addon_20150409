//2015/04/09 by ly

(function () {

	var context_menu = function (props, cb) {

		this.id = chrome.contextMenus.create(props, cb);

	}

	var helper = {
		op : Object.prototype,

		isArray,
		isObject,
		isFunction,

	}
	var option,
	content_script,
	remote_server;

	option = { ,
		handler = {
			save,
			load,
			reset
		};
	};
	content_script = {

		handler = {
			save,
		}
	}

})();
