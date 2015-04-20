context_menu = {
	MODULE_NAME : 'context_menu',
	MODULE_INIT : function () {

		this.id = chrome.contextMenus.create(this.props, this.callback);

	},

	props : {
		title : "ËÑË÷ %s",
		contexts : ["all"],
		documentUrlPatterns : ["*://*/*"],
		targetUrlPatterns : ["src:*"],
		onclick : function (info, t) {
			if (info.selectionText !== undefined) {
				var kw = info.selectionText;
				helper.invoke('sys', 'grab', {
					kw : kw
				});
			}
		}
	},
	callback : function () {
		DEBUG.LOG("Succeed to install.");
	},
	id : 0,
	init :
}
