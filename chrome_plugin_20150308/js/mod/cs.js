var hack = {
	TAG : 'cs hack',
	url : window.location.href,
	init : function () {
		mod = MODULE_MAPS[1];
		MODULE.INIT(this, mod.id, mod.name, mod.desc, mod.events);
	},
	save : function (res) {
		this.fire('save', res, this.on_save);
	},
	load : function () {
		this.fire('load', '', this.on_load);
	},
	on_load : function (sites) {
		try {
			if (isArray(sites)) {
				for (var i = 0; i < sites.length; i++) {
					var site = sites[i];
					var index = hack.url.indexOf(site['url']);
					if (index != -1) {
						index = site['url'].length;
						var keyword = hack.url.substr(index);
						var max = site['max'];
						var sum = $(site['patterns'][0]['selector']).length;
						var len = (sum > max) ? max : sum;
						var data = [];
						for (var j = 0; j < len; j++) {
							var temp = {};
							for (var k = 0; k < site['patterns'].length; k++) {
								var selector = site['patterns'][k]['selector'];
								var key = site['patterns'][k]['key'];
								var value = site['patterns'][k]['value'];
								value = hack.get_data($(selector)[j], value);
								temp[key] = value;
							}
							data[j] = temp;
						}
						var res = {
							keyword : keyword,
							len : len,
							sum : sum,
							max : max,
							data : data
						};
						hack.save(res);
					}
				}
			}
		} catch (e) {
			alert(JSON.stringify(e));
		}
	},
	on_save : function (data) {
	/* 	alert(JSON.stringify(data)); */
	},
	get_data : function (s, v) {
		var data;
		if (s) {
			var str = v.replace(/\s+/g, '');
			if (/^attr:(\S+)$/.exec(str)) {
				data = $(s).attr(/^attr:(\S+)$/.exec(str)[1]);
			} else if
			(/^prop:(\S+)$/.exec(str)) {
				data = $(s).prop(/^prop:(\S+)$/.exec(str)[1]);
			} else if
			(/^text$/.exec(str)) {
				data = $(s).text();
			}
		}
		data = data.replace(/\n/g, '');
		return data ? data : '空';
	},
	exec : function () {
		this.load();
	}
};
hack.init();
hack.exec();
