sap.ui.define([
	"be/hensens/cai/export/controller/Shared",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function (SharedCntlr, MessageBox, History, JSONModel) {
	"use strict";

	var SettingsCntlr = SharedCntlr.extend("be.hensens.cai.export.controller.Settings", {
		constructor: function () {
			SharedCntlr.prototype.constructor.apply(this, arguments);
		}
	});

	SettingsCntlr.prototype.onInit = function () {
		SharedCntlr.prototype.onInit.apply(this, arguments);
	};

	SettingsCntlr.prototype.onNavBack = function () {
		if (this.getDirtyFlag()) {
			// pending changes to be saved
			MessageBox.warning(this._oTranslatableTexts.getText("settings.pendingChanges"), {
				title: this._oTranslatableTexts.getText("settings.title")
			});
		} else if (this.validateSettings(this.getOwnerComponent().getModel("settings").getProperty("/current"))) {
			var oHistory = History.getInstance();
	
			var sPreviousHash = oHistory.getPreviousHash();
	
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("Home", true);
			}
		} else {
			// invalid settings
			MessageBox.warning(this._oTranslatableTexts.getText("settings.invalid"), {
				title: this._oTranslatableTexts.getText("settings.title")
			});
		}
	};

	SettingsCntlr.prototype.onCancel = function (oControlEvent) {
		var oSettings = this.getView().getModel("settings").getProperty("/current");
		
		this.getView().getModel("settings").setProperty("/temporary", $.extend({}, oSettings));
		
		this.setDirtyFlag(false);
	};
	
	SettingsCntlr.prototype.onSave = function (oControlEvent) {
		var oSettings = this.getView().getModel("settings").getProperty("/temporary");
		
		if (this.validateSettings(oSettings)) {
			this.getView().getModel("settings").setProperty("/current", $.extend({}, oSettings));
			
			this.setDirtyFlag(false);
			
			this.onNavBack();
		} else {
			MessageBox.warning(this._oTranslatableTexts.getText("settings.invalid"), {
				title: this._oTranslatableTexts.getText("settings.title")
			});
		}
	};

	SettingsCntlr.prototype.getDirtyFlag = function () {
		return this._bIsDirty;
	};

	SettingsCntlr.prototype.setDirtyFlag = function (bIsDirty) {
		this._bIsDirty = bIsDirty;
	};
	
	SettingsCntlr.prototype.onInputChange = function (oControlEvent) {
		this.setDirtyFlag(true);
	};

	return SettingsCntlr;
});