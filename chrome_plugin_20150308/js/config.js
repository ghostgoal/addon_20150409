var RESOURCE_ID = ['settings', 'res'];
var RESOURCE_DEFAULT = [{
		server_info : [{
			username : 'guest',
			password : '123456',
			addr : '192.168.1.128',
			download : '/download',
			upload : '/upload',
		}],
		sites : [{
				max : 3,
				url : 'http://sukebei.nyaa.se/?page=search&cats=0_0&filter=0&term=',
				patterns : [{
						selector : '.tlistrow .tlistname',
						key : 'name',
						value : 'props:'
					}, {
						selector : '.tlistrow .tlistdownload',
						key : 'download',
						value : 'attr:href'
					}, {
						selector : '.tlistrow .tlistsize',
						key : 'size',
						value:'text'
					}
				],
				desc : '',
				enable : true
			}, {
				max : 3,
				url : 'http://www.btsts.com/s/',
				patterns : [{
						selector : '.i_info',
						key : 'name',
						value:'text'
						
					}, {
						selector : '.j_size a',
						key : 'download',
						value:'attr:href'
					}, {
						selector : '.j_size',
						key : 'size',
						value:'text'
					}
				],
				desc : '',
				enable : true
			}
		]
	}, {data:[]}

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
	},{
		name : 'content script',
		id : 'cs',
		events : ['save', 'load', 'reset'],
		desc : '内容脚本',
		enable : true
	},
	{
		name : 'popup page',
		id : 'pp',
		events : ['save', 'load', 'download'],
		desc : '弹出页',
		enable : true
	},
	{
		name : 'server interaction',
		id : 'si',
		events : ['load'],
		desc : '服务器交互',
		enable : true
	}
];
