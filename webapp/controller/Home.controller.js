sap.ui.define([
	"be/hensens/cai/export/controller/Shared",
	"sap/m/MessageBox"
], function (SharedCntlr, MessageBox) {
	"use strict";

	var HomeCntlr = SharedCntlr.extend("be.hensens.cai.export.controller.Home", {
		constructor: function () {
			SharedCntlr.prototype.constructor.apply(this, arguments);
		}
	});

	HomeCntlr.prototype.onInit = function () {
		SharedCntlr.prototype.onInit.apply(this, arguments);
		
		this._oBotModel.setData({
			intents: [],
			gazettes: [],
			loadState: {}
		});
		
		if (this.validateSettings(this.getOwnerComponent().getModel("settings").getProperty("/current"))) {
			this.getTileInfo(this.getOwnerComponent().getModel("settings").getProperty("/current"), this._oBotModel)
				.catch(function (sError) {
					MessageBox.error(sError, {
					    title: this._oTranslatableTexts.getText("home.tile.error")
					});
				}.bind(this));			
		} else {
			this.navToSettings();
		}
	};

	HomeCntlr.prototype.navToSettings = function () {
		var oSettings = this.getOwnerComponent().getModel("settings").getProperty("/current");
		
		this.getOwnerComponent().getModel("settings").setProperty("/temporary", $.extend({}, oSettings));
		
		this.getOwnerComponent().getRouter().navTo("Settings");
	};
	
	HomeCntlr.prototype.navToIntents = function (oControlEvent) {
		if (oControlEvent.getSource().getProperty("state") === sap.m.LoadState.Loaded) {
			this.getOwnerComponent().getRouter().navTo("Intents");
		}
	};

	HomeCntlr.prototype.navToEntities = function (oControlEvent) {
		if (oControlEvent.getSource().getProperty("state") === sap.m.LoadState.Loaded) {
			this.getOwnerComponent().getRouter().navTo("Entities");
		}
	};
	
	return HomeCntlr;
});