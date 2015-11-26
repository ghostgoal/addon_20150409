var pic_collector = function () {
	var THISOBJ = this;
	this.isRelatedPage = function (page) {
		return (page.indexOf(this.mainPage) != -1);
	}
	this.getRelatedPages = function () {
		chrome.tabs.sendMessage(this.mainPageID, {
			act : 'GET_RELATED_PAGES',
			pattern : THISOBJ.settings.pattern_related_pages
		}, function (response) {

			if (response) {
				var relatedPages = response.relatedPages || [];
				for (var i = 0; i < relatedPages.length; i++) {
					page = relatedPages[i];
					if (THISOBJ.isRelatedPage(page)) {
						chrome.tabs.create({
							url : page
						}, function (tab) {
							THISOBJ.relatedPageIDs[tab.url] = tab.id;
							alert(tab.id);
						});
					}
				}
			} else {

				alert(response);
			}
		});
	}
	this.shutdown = function (page) {}
	this.setup = function (keyword, mainPage, mainPageID, settings) {
		this.keyword = keyword || 0;
		this.mainPage = mainPage || 0;
		this.mainPageID = mainPageID || 0;
		this.settings = settings || 0;
		this.relatedPageIDs = {};
		if (this.keyword && this.mainPage && this.mainPageID, this.settings) {
			this.getRelatedPages();
		} else {
			alert('Failed to setup pic_collector!');
		}
	}
}
