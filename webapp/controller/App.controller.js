sap.ui.define([
	"be/hensens/cai/export/controller/Shared",
	"sap/m/MessageBox"
], function (SharedCntlr, MessageBox) {
	"use strict";

	var AppCntlr = SharedCntlr.extend("be.hensens.cai.export.controller.App", {
		constructor: function () {
			SharedCntlr.prototype.constructor.apply(this, arguments);
		}
	});

	AppCntlr.prototype.onInit = function () {
		SharedCntlr.prototype.onInit.apply(this, arguments);
		
		this.getOwnerComponent().getRouter().attachBeforeRouteMatched(function (oEvent) {
			switch (oEvent.getParameter("name")) {
				case "Home":
					this.byId("app").setMode("HideMode");
					
					this.getTileInfo(this.getOwnerComponent().getModel("settings").getProperty("/current"), this._oBotModel)
						.catch(function (sError) {
							MessageBox.error(sError, {
							    title: this._oTranslatableTexts.getText("home.tile.error")
							});
						}.bind(this));
	
					break;
				case "Settings":
					this.byId("app").setMode("HideMode");
	
					break;
				default:
					this.byId("app").setMode("ShowHideMode");
			}
		}.bind(this));
	};

	return AppCntlr;
});