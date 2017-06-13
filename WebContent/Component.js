sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/UIComponent",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/json/JSONModel",
    "./interface/DataPersistenceInterface"
], function(jQuery, BaseUIComponent, ResourceModel, JSONModel, DataPersistenceInterface) {
	"use strict";

	var component = BaseUIComponent.extend("com.tasky.Component", {
        _MOCK_LOCAL_MODEL_JSON: "/mockData.json",
        _TASK_META_MODEL_JSON: "/taskMetadata.json",
        _LANGUAGE_MODEL_JSON: "/languages.json",

        _oApplication: null,
        _oViews: {},

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

            if(this.getRouter()){
                try{
                    this.getRouter().initialize();
                }catch(ex){
                    console.error(ex);
                }
            }

            this._oApplication = this.getRootControl().byId("TaskyApp");

            var taskMetadataModel = this.getModel("taskMetadata");
            if(taskMetadataModel){
                taskMetadataModel.attachEvent("requestCompleted", function(oEvent){
                    this._updateTaskMetadataLabels();
                }.bind(this));
            }

            var dataModel = this.getModel();
            if(dataModel){
                dataModel.attachEvent("requestCompleted", function(oEvent){
                    this._fixDataConnections();
                }.bind(this));
            }

            var i18nModel = this.getModel("i18n");
            if(i18nModel){
                document.title = i18nModel.getProperty("GENERAL.PAGE.TITLE");
            }

            this._oViews = this._createViewMap();

            console.log(this);
        },

        getView: function(sViewId){
            return this._oViews.hasOwnProperty(sViewId) ? this._oViews[sViewId] : null;
        },

        _createViewMap: function(){
            var pages, i, prop;

            var viewMap = {};
            viewMap.root = this.getRootControl();

            pages = this._oApplication.getMasterPages();
            for(i = 0; i < pages.length; i++){
                prop = pages[i].getId();
                prop = prop.split("--");
                prop = prop[prop.length - 1];

                viewMap[prop] = pages[i];
            }

            pages = this._oApplication.getDetailPages();
            for(i = 0; i < pages.length; i++){
                prop = pages[i].getId();
                prop = prop.split("--");
                prop = prop[prop.length - 1];

                viewMap[prop] = pages[i];
            }

            return viewMap;
        },

        _updateTaskMetadataLabels: function(){
            var taskMetadataModel = this.getModel("taskMetadata");
            var i18nModel = this.getModel("i18n");
            if(taskMetadataModel && i18nModel){
                var taskStatuses = taskMetadataModel.getProperty("/TaskStatuses");
                for(var i = 0; i < taskStatuses.length; i++){
                    taskStatuses[i].value = i18nModel.getProperty(taskStatuses[i].value);
                }
                taskMetadataModel.setProperty("/TaskStatuses", taskStatuses);
            }
        },

        _fixDataConnections: function(){
            var dataModel = this.getModel();
            if(dataModel){

            }
        }
	});

	return component;
});
