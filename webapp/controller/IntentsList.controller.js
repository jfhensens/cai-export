sap.ui.define([
	"be/hensens/cai/export/controller/Shared",
	"be/hensens/cai/export/libs/jszip.min",
	"sap/m/MessageBox",
	"sap/m/UploadCollectionItem",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/routing/History",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportCell",
	"sap/ui/core/util/ExportColumn",
	"sap/ui/core/util/ExportRow",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/json/JSONModel"
], function (SharedCntlr, JSZip, MessageBox, UploadCollectionItem, DateFormat, History, Export, ExportCell, ExportColumn, ExportRow, ExportTypeCSV, JSONModel) {
	"use strict";

	var IntentsListCntlr = SharedCntlr.extend("be.hensens.cai.export.controller.IntentsList", {
		constructor: function () {
			SharedCntlr.prototype.constructor.apply(this, arguments);
		}
	});

	IntentsListCntlr.prototype.onInit = function () {
		SharedCntlr.prototype.onInit.apply(this, arguments);
	};

	IntentsListCntlr.prototype.onItemSelectionChanged = function (oControlEvent) {
		var oListItem;
		
		if (oControlEvent.getParameter("selectAll")) {
			oListItem = oControlEvent.getSource().getSelectedItems()[0];
		} else {
			oListItem = oControlEvent.getParameter("listItem");
		}
		
		if (oListItem && oListItem.getSelected()) {
			this._oBotModel.setProperty("/selectedIntent", oListItem.data("slug"));
			
			this.getIntent(this.getView().getModel("settings").getProperty("/current"), oListItem.data("slug"))
				.then(function (oIntent) {
					this._oBotModel.setProperty("/expressions", oIntent.expressions.map(function (oExpression) {
						return {
							name: oIntent.name,
							language: oExpression.language.isocode,
							source: oExpression.source
						};
					}));
				}.bind(this));
		} else {
			this._oBotModel.setProperty("/selectedIntent", null);
			
			this._oBotModel.setProperty("/expressions", []);
		}
		
		this._oBotModel.refresh(true);
	};
	
	IntentsListCntlr.prototype.onSelectAll = function (oControlEvent) {
		this.byId("intentsList").selectAll().fireSelectionChange({
			selectAll: true
		});
	};
	
	IntentsListCntlr.prototype.onSelectNone = function (oControlEvent) {
		this.byId("intentsList").removeSelections(true).fireSelectionChange();
	};
	
	IntentsListCntlr.prototype.onRefresh = function (oControlEvent) {
		this.byId("intentsList").removeSelections(true).fireSelectionChange().setBusy(true);
		
		this.getTileInfo(this.getView().getModel("settings").getProperty("/current"), this._oBotModel)
			.then(function () {
				this.byId("intentsList").setBusy(false);
			}.bind(this))
			.catch(function (sError) {
				MessageBox.error(sError, {
				    title: this._oTranslatableTexts.getText("home.tile.error")
				});
			}.bind(this));
	};

	IntentsListCntlr.prototype.onNavBack = function () {
		var oHistory = History.getInstance();

		var sPreviousHash = oHistory.getPreviousHash();

		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			this.getOwnerComponent().getRouter().navTo("Home", true);
		}
	};
	
	IntentsListCntlr.prototype.onExport = function (oControlEvent) {
		this.getView().setBusy(true);
		
		var oArchiver = new window.JSZip();  // Without any loader, JSZip will declare in the global scope a variable named JSZip
		
		Promise.all(
			this.byId("intentsList").getSelectedItems().map(function (oSelectedItem) {
				return this.getIntent(this.getView().getModel("settings").getProperty("/current"), oSelectedItem.data("slug"));
			}.bind(this))
		)
			.then(function (aIntents) {
				return Promise.all(
					aIntents.map(function (oIntent) {
						var oIntentModel = new JSONModel(oIntent);
						
						var oExport = new Export({
							exportType: new ExportTypeCSV({
								byteOrderMark: true,
								charset: "utf-8",
								fileExtension: "csv",
								mimeType: "text/csv",
								separatorChar: ";"
							}),
							models: oIntentModel,
							rows: {
								path: "/expressions"
							},
							columns: [
						        {
						            name: "expression",
						            template: {
						                content: {
						                    path: "source"
						                }
						            }
						        },
						        {
						            name: "language",
						            template: {
						                content: {
						                    path: "language/isocode"
						                }
						            }
						        }
							]
						});
						
						return oExport.generate()
							.then(function (sContent) {
								return {
									name: oIntentModel.getProperty("/slug") + "." + this.getExportType().getFileExtension(), 
									content: sContent
								};
							});
					})
				);
			})
			.then(function (aFiles) {
				aFiles.forEach(function (oFile) {
					oArchiver.file(oFile.name, oFile.content);
				});
				
				oArchiver.generateAsync({
					type: "base64"
				})
					.then(function (oData) {
					    var oUploadCollectionItem = new UploadCollectionItem({
					    	fileName: this.getView().getModel("settings").getProperty("/current/botSlug") + "_" + this.getTimestamp() + ".zip",
					    	mimeType: "application/zip",
					    	url: "data:application/zip;base64," + oData
					    });
					    
					    oUploadCollectionItem.download(true);
					    
					    this.getView().setBusy(false);
					}.bind(this));
			}.bind(this));
	};
	
	IntentsListCntlr.prototype.getTimestamp = function () {
		var oFormatter = DateFormat.getDateInstance({
			pattern : "yyyyMMddHHmmss"
		});
		
		return oFormatter.format(new Date());
	};
	
	return IntentsListCntlr;
});