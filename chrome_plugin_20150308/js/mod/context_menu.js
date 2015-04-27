$(function () {
	var mod = {
		def = {
			title : "ËÑË÷ %s",
			contexts : ["all"],
			documentUrlPatterns : ["*://*/*"],
			targetUrlPatterns : ["src:*"],
		},
		init : function (cp) {
			this.cp = cp || def;
			this.cp.onclick = this.onclick;
			this.mid = chrome.contextMenus.create(this.cp, this.oncreate);
		},
		onclick : function (info, tab) {
			alert(this);
			alert(JSON.stringify(info));
		},
		oncreate : function () {
			alert(this);
			alert(JSON.stringify(Chrome.extension.lastError));
		}
	}
});
