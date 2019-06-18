sap.ui.define([
	"be/hensens/cai/export/controller/Shared"
], function (SharedCntlr, History) {
	"use strict";

	var EntitiesDetailsCntlr = SharedCntlr.extend("be.hensens.cai.export.controller.EntitiesDetails", {
		constructor: function () {
			SharedCntlr.prototype.constructor.apply(this, arguments);
		}
	});
	
	EntitiesDetailsCntlr.prototype.onInit = function () {
		SharedCntlr.prototype.onInit.apply(this, arguments);
	};
	
	EntitiesDetailsCntlr.prototype.onItemSelectionChanged = function (oControlEvent) {
		this.getView().setBusy(true);
		
		var oSelectedItem = oControlEvent.getParameter("selectedItem");
		
		if (oSelectedItem) {
			this.getGazette(this.getView().getModel("settings").getProperty("/current"), oSelectedItem.getKey())
				.then(function (oGazette) {
					this._oBotModel.setProperty("/synonyms", oGazette.synonyms.map(function (oSynonym) {
						return {
							name: oGazette.entity.name,
							language: oSynonym.language.isocode,
							source: oSynonym.value
						};
					}));
					
					this.getView().setBusy(false);
				}.bind(this));
		}
	};

	return EntitiesDetailsCntlr;
});