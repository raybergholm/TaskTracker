sap.ui.define([
    "jquery.sap.global", // TODO. eh, is the documentation wrong? seems to be jQuery.sap
    "sap/ui/core/UIComponent",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/json/JSONModel",
    "com.tasky.interface.DataPersistenceInterface"
], function(jQuery, UIComponent, ResourceModel, JSONModel, DataPersistenceInterface) {
	"use strict";

	var Component = UIComponent.extend("com.tasky.Component", {
        _MOCK_LOCAL_MODEL_JSON: "/mockData.json",
        _LANGUAGE_MODEL_JSON: "/languages.json",

		metadata : {
            rootView: "com.tasky.view.App"
		},

        init: function(){
            UIComponent.prototype.init.apply(this, arguments);

            var i18nModel = new ResourceModel({
    			bundleName: "com.tasky.localisation.texts"
    		});
            this.setModel(i18nModel, "i18n");

            var langModel = new JSONModel(jQuery.sap.getModulePath("com.tasky.model") + this._LANGUAGE_MODEL_JSON);
            this.setModel(langModel, "lang");

            var localModel = new JSONModel(jQuery.sap.getModulePath("com.tasky.model") + this._MOCK_LOCAL_MODEL_JSON);
            this.setModel(localModel);

            console.log(langModel);
            console.log(localModel);

            document.title = i18nModel.getProperty("GENERAL.PAGE.TITLE");
        }
	});
	return Component;
});
