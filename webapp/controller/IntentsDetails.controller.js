sap.ui.define([
	"be/hensens/cai/export/controller/Shared"
], function (SharedCntlr, History) {
	"use strict";

	var IntentsDetailsCntlr = SharedCntlr.extend("be.hensens.cai.export.controller.IntentsDetails", {
		constructor: function () {
			SharedCntlr.prototype.constructor.apply(this, arguments);
		}
	});
	
	IntentsDetailsCntlr.prototype.onInit = function () {
		SharedCntlr.prototype.onInit.apply(this, arguments);
	};
	
	IntentsDetailsCntlr.prototype.onItemSelectionChanged = function (oControlEvent) {
		this.getView().setBusy(true);
		
		var oSelectedItem = oControlEvent.getParameter("selectedItem");
		
		if (oSelectedItem) {
			this.getIntent(this.getView().getModel("settings").getProperty("/current"), oSelectedItem.getKey())
				.then(function (oIntent) {
					this._oBotModel.setProperty("/expressions", oIntent.expressions.map(function (oExpression) {
						return {
							name: oIntent.name,
							language: oExpression.language.isocode,
							source: oExpression.source
						};
					}));
					
					this.getView().setBusy(false);
				}.bind(this));
		}
	};

	return IntentsDetailsCntlr;
});