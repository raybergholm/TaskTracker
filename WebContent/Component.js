sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/UIComponent",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/json/JSONModel",
    "./interface/DataPersistenceInterface"
], function(jQuery, BaseUIComponent, ResourceModel, JSONModel, DataPersistenceInterface) {
	"use strict";

	var Component = BaseUIComponent.extend("com.tasky.Component", {
        _MOCK_LOCAL_MODEL_JSON: "/mockData.json",
        _LANGUAGE_MODEL_JSON: "/languages.json",

        metadata : {
            manifest: "json",
		},

        createContent: function() {
            return sap.ui.view({
    			id: "Tasky",
    			viewName: "com.tasky.view.Root",
    			type: sap.ui.core.mvc.ViewType.XML,
    			viewData: {
    				component : this
    			}
    		});
        },

        init: function() {
            BaseUIComponent.prototype.init.apply(this, arguments);

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

            if(this.getRouter()){
                try{
                    this.getRouter().initialize();

                }catch(ex){
                    console.error(ex);
                }
            }
            document.title = i18nModel.getProperty("GENERAL.PAGE.TITLE");
        }
	});
	return Component;
});
