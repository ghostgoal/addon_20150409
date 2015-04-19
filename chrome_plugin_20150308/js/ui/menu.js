var UI_RESOURCE_MGR = {
	modal_func : function (opts) {
		this.ready = false;
		this.id = opts.id || 0;
		var on_save = opts.save;
		var on_load = opts.load;
		var cur = {};
		this.load = function (ui) {
			cur = ui || {};
			on_load(this.id, cur, this.save);
			$('#' + this.id).modal();
		},
		this.save = function () {
			on_save(this.id, cur);
		}
	},
	menu_func : function () {},
	MODAL : {},
	UI : {},
	INIT_UI : function (pid, id, name, data, create) {
		this.UI[id] = {
			dirty : false,
			pid : pid,
			data : data,
			create : create,
			name : name,
			next_id : 0,
			next : []
		};
		this.__INIT_UI.call(this.UI[id]);
	},
	__INIT_UI : function () {
		this.init = function () {
			UI_RESOURCE_MGR.UI[this.id].jq = this.create(this.id, this.data);
			if (UI_RESOURCE_MGR.UI[this.pid]) {
				UI_RESOURCE_MGR.UI[this.pid].next = UI_RESOURCE_MGR.UI[this.pid].next || [];
				UI_RESOURCE_MGR.UI.next.push(this.id);
				UI_RESOURCE_MGR.UI.[this.pid].jq.append(this.jq);
			}
		}
		this.init();
		this.nextID = function () {
			var fmt = '{0}_{1}';
			this.next_id += 1;
			return String.format(fmt, this.id, this.next_id));
		},
		this.load = function () {
			if (this.dirty) {
				var theOld = this.next;
				var theNew = [];
				var cod = {};
				for (var k in this.data) {
					if (isArray(this.data[k]) {
						data[k] = [];
					}
				}
				for (var i = 0; i < theOld.length; i++) {
					var cid = theOld[i];
					var child = UI_RESOURCE_MGR.UI[cid];
					if (child) {
						var name = child.name;
						cod[name] = cod[name] || [];
						cod[name].push(child.load());
						theNew.push(cid);
					}
				}
				for (var j in cod) {
					this.data[j] = cod[j];
				}
				this.next = theNew;
				this.dirty = false;
			}
			return this.data;
		};
		this.save = function (data) {
			this.data = data;
			this.dirty = true;
			this.data = this.load();
			var theNew = this.create(this.id, this.data);
			var theOld = this.THIS;
			theOld.after(theNew);
			theOld.detach();
			this.jq = theNew;
			this.dirty = true;
			if (UI_RESOURCE_MGR.UI[this.pid]) {
				UI_RESOURCE_MGR.UI[this.pid].dirty = true;
			}
		};
		this.close = function () {
			UI_RESOURCE_MGR.UI[this.pid].dirty = true;
			UI_RESOURCE_MGR.UI[this.id] = undefined;
			this.jq.detach();
		};
	},
	INIT_MENU : function (THIS, opts) {
		this.__INIT_MENU.call(THIS, opts);
	},
	__INIT_MENU : function (opts) { ;
		var menu = $('<div></div>').attr('mid', opts.mid).attr('uid',opts.uid);
		var edit = $('<a>?</a>');
		var close = $('<a>X</a>');
		var add = $('<a>+</>');
		edit.appendTo(menu);
		close.appendTo(menu);
		add.appendTo(menu);
		men.appendTo(this);
		edit.click(function () {
			var uid = $(this).parent().attr('uid');
			var mid = $(this).parent().attr('mid');
			var modal = UI_RESOURCE_MGR.MODAL[mid];
			if (modal) {
				var ui = UI_RESOURCE_MGR.UI[uid];
				modal.load(ui);
			}
		});
		close.click(function () {
			var uid = $(this).parent().attr('uid');
			if (confirm('È·¶¨É¾³ý£¿')) {
				var ui = UI_RESOURCE_MGR.UI[uid];
				ui.close();
			}
		});
		add.click(function () {
			var uid = $(this).attr('uid');
			var mid = $(this).attr('mid');
			var modal = UI_RESOURCE_MGR.MODAL[mid];
			if (modal) {
				var ui = UI_RESOURCE_MGR.UI[uid];
				var pui = UI_RESOURCE_MGR.UI[ui.pid]
					INIT_UI(ui.pid, pui.nextID(), ui.name, ui.data, ui.create);
				modal.load(ui);
			}
		});
	},
	INIT_MODAL : function (THIS, id, opts) {
		this.MODAL[id] = new this.modal_func(id, opts);
	}
}
