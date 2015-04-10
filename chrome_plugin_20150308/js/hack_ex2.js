(function () {
	var handlers,
	rules,
	url = window.location
		op = Object.prototype;
	var isArray = function (obj) {
		return op.toString.call(obj) === '[object Array]';
	}
	var isObject = function (obj) {
		return op.toString.call(obj) === '[object Object]';
	}
	handlers = {
		grab : function (r) {
			var urls = [];
			var max = r.max || 0;
			var s = $(r.p);
			var len = s.length;
			if (len) {
				max = max ? (len < max ? len : max) : len;
				for (var i = 0; i < max; i++) {
					var u = $(s[i]);
					urls.push(u.attr("href"));
				}
				chrome.extension.sendRequest({
					act : "save_bt",
					bt : urls,
					max : len
				}, function () {});
			}
		},
		load : function () {}

	};
	chrome.extension.sendRequest({
		act : "load_rule",
		url : url
	}, function (response) {
		rules = response;
		var h,
		r;
		if (isArray(rules)) {
			for (var i in rules) {
				r = rules[i];
				h = handlers[r.a] || {};
				h && h(r);
			}
		} else if (isObject(rules)) {
			r = rules;
			h = handlers[r.a];
			if (h) {
				h(r);
			}
		} else {
			alert(rules);
		}
	})
})();
