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
                    this._fixDataReferences();
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

        // The data encoded in the JSON uses IDs to flatten the various data references since it can become a massive pain to save a data struct with multiple refs of the same object scattered everywhere. So, we need to expand the refs when we finish reading the raw JSON.
        _fixDataReferences: function(){
            var i, j, timestamp, result;
            var dataModel = this.getModel();
            if(dataModel){
                var tasks = dataModel.getProperty("/Tasks");
                var users = dataModel.getProperty("/Users");
                var comments = dataModel.getProperty("/Comments");
                var todos = dataModel.getProperty("/Todos");

                // making this a local function since it's not needed elsewhere. If we do, then we could just make it more abstract and put it somewhere more general
                var matchCollection = function(collection, id){
                    for(var i = 0; i < collection.length; i++){
                        if(collection[i].id === id){
                            return collection[i];
                        }
                    }
                    return null;
                };

                for(i = 0; i < comments.length; i++){
                    result = matchCollection(users, comments[i].owner);
                    if(result){
                        comments[i].owner = result;
                    }
                }

                for(i = 0; i < tasks.length; i++){
                    result = matchCollection(users, tasks[i].owner);
                    if(result){
                        tasks[i].owner = result;
                    }

                    timestamp = new moment(tasks[i].dateCreated);
                    if(timestamp && timestamp.isValid()){
                        tasks[i].dateCreated = timestamp.toDate();
                    }

                    timestamp = new moment(tasks[i].dateLastUpdated);
                    if(timestamp && timestamp.isValid()){
                        tasks[i].dateLastUpdated = timestamp.toDate();
                    }

                    for(j = 0; j < tasks[i].comments.length; j++){
                        result = matchCollection(comments, tasks[i].comments[j]);
                        if(result){
                            tasks[i].comments[j] = result;
                        }
                    }

                    for(j = 0; j < tasks[i].todos.length; j++){
                        result = matchCollection(comments, tasks[i].todos[j]);
                        if(result){
                            tasks[i].todos[j] = result;
                        }
                    }
                }

                dataModel.setProperty("/Tasks", tasks);
                dataModel.setProperty("/Users", users);
                dataModel.setProperty("/Comments", comments);
                dataModel.setProperty("/Todos", todos);
            }
        }
	});

	return component;
});
