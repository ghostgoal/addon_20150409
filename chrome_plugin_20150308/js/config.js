var RESOURCE_ID = ['settings', 'res'];
var RESOURCE_DEFAULT = [{
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
	}, {}

];
var EVENTMAPS = [{
		id : 'sys',
		event : ['dump', 'grab', 'debug'],
		handler : ['dump', 'grab']
	}, {
		id : 'options',
		event : ['load', 'save', 'reset'],
		handler : ['load', 'save', 'reset']
	}, {
		id : 'rpc',
		event : ['load', 'save', 'download'],
		handler : ['load', 'save', 'download']
	}, {
		id : 'cs',
		event : ['load', 'save'],
		handler : ['load', 'save']
	}
];
var MODULE_MAPS = [{
		name : 'options page',
		id : 'op',
		events : ['save', 'load', 'reset'],
		desc : '选项页',
		enable : true
	}
];
