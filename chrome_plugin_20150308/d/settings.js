var settings = {
	ready : false,
	tag : '',
	def : {
		server_info : {
			username : 'guest',
			password : '123456',
			addr : '192.168.1.128',
			download : '/download',
			upload : '/upload',
		},
		sites : [{
				max : 3,
				url : 'http://sukebei.nyaa.se/?page=search&cats=0_0&filter=0&term=',
				patterns : [{
						selector : '.tlistrow .tlistname',
						name : 'name',
						type : 'props'
					}, {
						selector : '.tlistrow .tlistdownload',
						name : 'download',
						attr : 'href'
					}, {
						selector : '.tlistrow .tlistsize',
						name : 'size',
					}
				],
				desc : '',
				enable : true
			}, {
				max : 3,
				url : 'http://www.btsts.com/s/',
				patterns : [{
						selector : '.i_info',
						name : 'name',
					}, {
						selector : '.j_size a',
						name : 'download',
					}, {
						selector : '.j_size',
						name : 'size',
					}
				],
				desc : '',
				enable : true
			}
		]
	},
	cur : {},
	ls : window.localStorage,
	init : function (tag) {
		if (ls) {
			this.ready = true;
		}
		this.tag = tag || 'settings';
		this.cur = (this.ready && ls[tag]) ? JSON.parse(ls[tag]) : def;
	},
	event : ['load', 'save', 'reset'],
	load : function () {
		return this.cur;
	},
	save : function (s) {
		this.cur = s;
		if (this.ready) {
			ls[tag] = JSON.stringify(this.cur);
		}
	},
	reset : function () {
		return this.def;
	}
}
