var ls = function (id) {
	var id = id;
	var ready = false;
	var ss = window.localStorage;
	if (ss) {
		ready = true;
	}
	this.cur = {};
	this.save = function (s) {
		this.cur = s;
		if (ready) {
			ss[id] = JSON.stringify(s);
		}
	};
	this.load = function () {
		if (ready) {
			this.cur = JSON.parse(ss[id]);
		}
	}
}
