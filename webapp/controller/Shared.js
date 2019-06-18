sap.ui.define([
	"be/hensens/cai/export/model/Formatter",
	"sap/ui/core/mvc/Controller"
], function (Formatter, Controller) {
	"use strict";

	var SharedCntlr = Controller.extend("be.hensens.cai.export.controller.Shared", {
		constructor: function () {
			Controller.prototype.constructor.apply(this, arguments);
			
			this.formatter = new Formatter();
		}
	});
	
	SharedCntlr.prototype.onInit = function () {
		this._oTranslatableTexts = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		
		this._oBotModel = this.getOwnerComponent().getModel("bot");
	};

	// SharedCntlr.prototype.onExit = function () {};

	// SharedCntlr.prototype.onBeforeRendering = function () {};

	// SharedCntlr.prototype.onAfterRendering = function () {};

	SharedCntlr.prototype.getTileInfo = function (oSettings, oBotModel) {
		oBotModel.setProperty("/intents", []);
					
		oBotModel.setProperty("/gazettes", []);
		
		oBotModel.setProperty("/loadState", {
			intents: sap.m.LoadState.Loading,
			gazettes: sap.m.LoadState.Loading
		});
		
		return new Promise(function (resolve, reject) {
			$.ajax({
				type: "GET",
				url: oSettings.url.dataset
					.replace("$USER_SLUG", oSettings.userSlug)
					.replace("$BOT_SLUG", oSettings.botSlug)
					.replace("$VERSION_SLUG", oSettings.versionSlug || "v1"),
				async: true,
				cache: false,
				contentType: "application/json",
				headers: {
					"Authorization" : "Token " + oSettings.developerToken
				}
			})
				.done(function (oResponse, sStatus, oRequest) {
					var aIntents = oResponse.results.intents;
					
					oBotModel.setProperty("/intents", aIntents);
					
					if (aIntents && Array.isArray(aIntents)) {
						oBotModel.setProperty("/loadState/intents", sap.m.LoadState.Loaded);
					} else {
						oBotModel.setProperty("/loadState/intents", sap.m.LoadState.Disabled);
					}
					
					var aGazettes = oResponse.results.gazettes.filter(function (oGazette) {
						return oGazette.entity.custom;  // Has the entity been created by the community?
					});
					
					oBotModel.setProperty("/gazettes", aGazettes);
					
					if (aGazettes && Array.isArray(aGazettes)) {
						oBotModel.setProperty("/loadState/gazettes", sap.m.LoadState.Loaded);
					} else {
						oBotModel.setProperty("/loadState/gazettes", sap.m.LoadState.Disabled);
					}
					
					resolve();
				})
				.fail(function (oRequest, sStatus, oError) {
					oBotModel.setProperty("/loadState", {
						intents: sap.m.LoadState.Failed,
						gazettes: sap.m.LoadState.Failed
					});
					
					reject("XHR failed loading: " + this.type + " '" + new URL(this.url, window.location.href).href + "'. (Status " + oRequest.status + ")");
				});
		});
	};
	
	SharedCntlr.prototype.getIntent = function (oSettings, sSlug) {
		return new Promise(function (resolve, reject) {
			$.ajax({
				type: "GET",
				url: oSettings.url.intent
					.replace("$USER_SLUG", oSettings.userSlug)
					.replace("$BOT_SLUG", oSettings.botSlug)
					.replace("$VERSION_SLUG", oSettings.versionSlug || "v1")
					.replace("$INTENT_SLUG", sSlug),
				async: true,
				cache: false,
				contentType: "application/json",
				headers: {
					"Authorization" : "Token " + oSettings.developerToken
				}
			})
				.done(function (oResponse, sStatus, oRequest) {
					resolve(oResponse.results);
				})
				.fail(function (oRequest, sStatus, oError) {
					reject("XHR failed loading: " + this.type + " '" + new URL(this.url, window.location.href).href + "'. (Status " + oRequest.status + ")");
				});
		});
	};
	
	SharedCntlr.prototype.getGazette = function (oSettings, sSlug) {
		return new Promise(function (resolve, reject) {
			$.ajax({
				type: "GET",
				url: oSettings.url.gazette
					.replace("$USER_SLUG", oSettings.userSlug)
					.replace("$BOT_SLUG", oSettings.botSlug)
					.replace("$VERSION_SLUG", oSettings.versionSlug || "v1")
					.replace("$GAZETTE_SLUG", sSlug),
				async: true,
				cache: false,
				contentType: "application/json",
				headers: {
					"Authorization" : "Token " + oSettings.developerToken
				}
			})
				.done(function (oResponse, sStatus, oRequest) {
					resolve(oResponse.results);
				})
				.fail(function (oRequest, sStatus, oError) {
					reject("XHR failed loading: " + this.type + " '" + new URL(this.url, window.location.href).href + "'. (Status " + oRequest.status + ")");
				});
		});
	};
	
	SharedCntlr.prototype.validateSettings = function (oSettings) {
		return ((oSettings.userSlug || "").length > 1 
			&& (oSettings.botSlug || "").length > 1
			&& (oSettings.developerToken || "").length === 32);
	};


	return SharedCntlr;
});