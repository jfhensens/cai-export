sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, JSONModel) {
	"use strict";

	var Component = UIComponent.extend("be.hensens.cai.export.Component", {
		metadata: {
			manifest: "json"
		}
	});

	Component.prototype.init = function () {
		UIComponent.prototype.init.apply(this, arguments);

		this.createDeviceModel();

		this.getRouter().initialize();
	};

	Component.prototype.createDeviceModel = function () {
		var oDeviceModel = new JSONModel(Device);

		oDeviceModel.setDefaultBindingMode("OneWay");

		this.setModel(oDeviceModel, "device");
	};

	return Component;
});