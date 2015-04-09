
function () {
	var handlers,
	rules,
	url = window.location;
	var isArray;
	var isObject;
	handlers = {
		grab : function () {}
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
			for (r in rules) {
				h = handlers[r.a] || {};
				h && h(r.p);
			}
		} else if (isObject(rules)) {
			r = rules;
			h = handlers[r.a];
			if (h) {
				h(r.p);
			}
		} else {
			alert(rules);
		}
	})
}
