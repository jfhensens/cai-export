sap.ui.define([
	"sap/ui/base/Object"
], function (BaseObject) {
	"use strict";

	var Formatter = BaseObject.extend("be.hensens.cai.export.model.Formatter", {
		constructor: function () {
			BaseObject.prototype.constructor.apply(this, arguments);
		}
	});

	Formatter.prototype.countInstances = function (aInstances) {
		var iCount;
		
		if (aInstances && Array.isArray(aInstances)) {
			iCount = aInstances.length;
		}
		
		return iCount;
	};
	
	Formatter.prototype.countSelected = function (aInstances) {
		var iCount;
		
		if (aInstances && Array.isArray(aInstances)) {
			iCount = aInstances.filter(function (oInstance) {
				return oInstance.selected;
			}).length;
		}
		
		return iCount;
	};
	
	return Formatter;
});