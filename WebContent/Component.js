// TODO: This class bloated out a fair bit. Maybe abstract out the data format and file handling some more?

sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/UIComponent",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "./interface/DataPersistenceInterface",
    "./manager/IdManager"
], function(jQuery, BaseUIComponent, ResourceModel, JSONModel, MessageToast, MessageBox, DataPersistenceInterface, IdManager) {
    "use strict";

    var component = BaseUIComponent.extend("com.tasky.Component", {
        _MOCK_LOCAL_MODEL_JSON: "/mockData.json",
        _TASK_META_MODEL_JSON: "/taskMetadata.json",
        _LANGUAGE_MODEL_JSON: "/languages.json",

        _STORAGE_KEY: "taskyData",

        _oApplication: null,
        _oViews: {},
        _oIdManager: null,
        _oDataPersistenceInterface: DataPersistenceInterface,

        metadata: {
            manifest: "json",
        },

        createContent: function() {
            return sap.ui.view({
                id: "Tasky",
                viewName: "com.tasky.view.Root",
                type: sap.ui.core.mvc.ViewType.XML,
                viewData: {
                    component: this
                }
            });
        },

        init: function() {
            BaseUIComponent.prototype.init.apply(this, arguments);

            if(this.getRouter()) {
                try {
                    this.getRouter().initialize();
                } catch(ex) {
                    console.error(ex);
                }
            }

            this._oApplication = this.getRootControl().byId("TaskyApp");

            var taskMetadataModel = this.getModel("taskMetadata");
            if(taskMetadataModel) {
                taskMetadataModel.attachEvent("requestCompleted", function(oEvent) {
                    this._updateTaskMetadataLabels();
                }.bind(this));
            }

            var dataModel = this.getModel();
            if(dataModel) {
                dataModel.attachEvent("requestCompleted", function(oEvent) {
                    this._initialDataSetup();
                }.bind(this));
            }

            var i18nModel = this.getModel("i18n");
            if(i18nModel) {
                var rng = Math.round((Math.random() * 2) + 1);
                var randomQuip = i18nModel.getProperty("GENERAL.PAGE.QUIP" + rng)

                document.title = i18nModel.getResourceBundle().getText("GENERAL.PAGE.TITLE", [randomQuip]);
            }

            var fileModel = this.getModel("file");
            if(fileModel) {
                fileModel.setProperty("/Filepath", "C:/default_data.json");
            }

            this._oViews = this._createViewMap();

            // if(this._oDataPersistenceInterface){ // FIXME: apparently, this block crashes the app because it's suddenly trying to call this._oViews.destroy from somewhere, somehow for some reason.
            //     this._oDataPersistenceInterface.init();
            // }

            console.log(this);
        },

        getView: function(sViewId) {
            return this._oViews.hasOwnProperty(sViewId) ? this._oViews[sViewId] : null;
        },

        getIdManager: function() {
            return this._idManager;
        },

        load: function() {
            var i18nModel = this.getModel("i18n");

            if(!this._oDataPersistenceInterface) {
                console.error(i18nModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"));

                MessageBox.error(i18nModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"), {
                    title: i18nModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
                });

                return;
            }

            var success = false;
            var rawDataString = _oDataPersistenceInterface.loadData(this._STORAGE_KEY);
            if(rawDataString) {
                var jsonData = JSON.parse(rawDataString);
                var dataModel = this.getModel();
                if(dataModel) {
                    dataModel.setData(jsonData);
                    this._initialDataSetup();
                    success = true;
                }
            }

            if(success) {
                MessageToast.show(i18nModel.getProperty("NOTIFICATIONS.LOAD_COMPLETE"));
            } else {
                MessageBox.error(i18nModel.getProperty("NOTIFICATIONS.LOAD_FAILED"), {
                    title: i18nModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
                });
            }
        },

        save: function() {
            var i18nModel = this.getModel("i18n");

            if(!this._oDataPersistenceInterface) {
                console.error(i18nModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"));

                MessageBox.error(i18nModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"), {
                    title: i18nModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
                });

                return;
            }

            var exportableData = this.createExportableData();

            console.log(exportableData);

            var saveDataString = JSON.stringify(exportableData);

            console.log(saveDataString);

            var success = this._oDataPersistenceInterface.saveData(this._STORAGE_KEY, saveDataString);

            if(success) {
                MessageToast.show(i18nModel.getProperty("NOTIFICATIONS.SAVE_COMPLETE"));
            } else {
                MessageBox.error(i18nModel.getProperty("NOTIFICATIONS.SAVE_FAILED"), {
                    title: i18nModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
                });
            }
        },

        createExportableData: function() { // clone data, format dates and flatten refs down to IDs
            var i, j, entry;
            var data = this.getModel().getData();
            var exportableData = {
                Tasks: [],
                Users: [],
                Comments: [],
                Todos: []
            };

            for(i = 0; i < data.Tasks.length; i++) {
                entry = jsUtils.Object.clone(data.Tasks[i]);

                entry.dateCreated = (new moment(entry.dateCreated)).format();
                entry.dateLastUpdated = (new moment(entry.dateLastUpdated)).format();
                entry.owner = entry.owner.id;

                entry.comments = jsUtils.Object.clone(entry.comments);
                for(j = 0; j < entry.comments.length; j++) {
                    entry.comments[j] = entry.comments[j].id;
                }

                entry.todos = jsUtils.Object.clone(entry.todos);
                for(j = 0; j < entry.todos.length; j++) {
                    entry.todos[j] = entry.todos[j].id;
                }

                exportableData.Tasks.push(entry);
            }

            for(i = 0; i < data.Users.length; i++) {
                entry = jsUtils.Object.clone(data.Users[i]);

                entry.lastOnline = (new moment(entry.lastOnline)).format();

                exportableData.Users.push(entry);
            }

            for(i = 0; i < data.Comments.length; i++) {
                entry = jsUtils.Object.clone(data.Comments[i]);

                entry.dateCreated = (new moment(entry.dateCreated)).format();
                entry.dateLastUpdated = (new moment(entry.dateLastUpdated)).format();
                entry.owner = entry.owner.id;

                exportableData.Comments.push(entry);
            }

            for(i = 0; i < data.Todos.length; i++) {
                entry = jsUtils.Object.clone(data.Todos[i]);

                exportableData.Todos.push(entry);
            }

            return exportableData;
        },

        _createViewMap: function() {
            var pages, i, prop;

            var viewMap = {};
            viewMap.root = this.getRootControl();

            pages = this._oApplication.getMasterPages();
            for(i = 0; i < pages.length; i++) {
                prop = pages[i].getId();
                prop = prop.split("--");
                prop = prop[prop.length - 1];

                viewMap[prop] = pages[i];
            }

            pages = this._oApplication.getDetailPages();
            for(i = 0; i < pages.length; i++) {
                prop = pages[i].getId();
                prop = prop.split("--");
                prop = prop[prop.length - 1];

                viewMap[prop] = pages[i];
            }

            return viewMap;
        },

        _updateTaskMetadataLabels: function() {
            var taskMetadataModel = this.getModel("taskMetadata");
            var i18nModel = this.getModel("i18n");
            if(taskMetadataModel && i18nModel) {
                var taskStatuses = taskMetadataModel.getProperty("/TaskStatuses");
                for(var i = 0; i < taskStatuses.length; i++) {
                    taskStatuses[i].value = i18nModel.getProperty(taskStatuses[i].value);
                }
                taskMetadataModel.setProperty("/TaskStatuses", taskStatuses);
            }
        },

        _firstTimeUserProcess: function(){

        },

        _initialDataSetup: function() {
            var dataModel = this.getModel();
            if(dataModel) {
                this._fixDataReferences(dataModel);
                this._initializeWorkarea(dataModel);
                this._setCurrentUser(dataModel);

                this._idManager = new IdManager();
                this._idManager.linkDataModel(dataModel);
            }
        },

        _initializeWorkarea: function(dataModel) {
            if(dataModel) {
                dataModel.setProperty("/Temp", {
                    SelectedTask: null,
                    SelectedTaskPath: "",
                    CurrentUser: null
                });
            }
        },

        // The data encoded in the JSON uses IDs to flatten the various data references since it can become a massive pain to save a data struct with multiple refs of the same object scattered everywhere. So, we need to expand the refs when we finish reading the raw JSON.
        _fixDataReferences: function(dataModel) {
            var i, j, timestamp, result;

            if(dataModel) {
                var tasks = dataModel.getProperty("/Tasks");
                var users = dataModel.getProperty("/Users");
                var comments = dataModel.getProperty("/Comments");
                var todos = dataModel.getProperty("/Todos");

                // making this a local function since it's not needed elsewhere. If we do, then we could just make it more abstract and put it somewhere more general
                var matchCollection = function(collection, id) {
                    for(var i = 0; i < collection.length; i++) {
                        if(collection[i].id === id) {
                            return collection[i];
                        }
                    }
                    return null;
                };

                for(i = 0; i < comments.length; i++) {
                    result = matchCollection(users, comments[i].owner);
                    if(result) {
                        comments[i].owner = result;
                    }

                    timestamp = new moment(comments[i].dateCreated);
                    if(timestamp && timestamp.isValid()) {
                        comments[i].dateCreated = timestamp.toDate();
                    }

                    timestamp = new moment(comments[i].dateLastUpdated);
                    if(timestamp && timestamp.isValid()) {
                        comments[i].dateLastUpdated = timestamp.toDate();
                    }
                }

                for(i = 0; i < tasks.length; i++) {
                    result = matchCollection(users, tasks[i].owner);
                    if(result) {
                        tasks[i].owner = result;
                    }

                    timestamp = new moment(tasks[i].dateCreated);
                    if(timestamp && timestamp.isValid()) {
                        tasks[i].dateCreated = timestamp.toDate();
                    }

                    timestamp = new moment(tasks[i].dateLastUpdated);
                    if(timestamp && timestamp.isValid()) {
                        tasks[i].dateLastUpdated = timestamp.toDate();
                    }

                    for(j = 0; j < tasks[i].comments.length; j++) {
                        result = matchCollection(comments, tasks[i].comments[j]);
                        if(result) {
                            tasks[i].comments[j] = result;
                        }
                    }

                    for(j = 0; j < tasks[i].todos.length; j++) {
                        result = matchCollection(todos, tasks[i].todos[j]);
                        if(result) {
                            tasks[i].todos[j] = result;
                        }
                    }
                }

                dataModel.setProperty("/Tasks", tasks);
                dataModel.setProperty("/Users", users);
                dataModel.setProperty("/Comments", comments);
                dataModel.setProperty("/Todos", todos);
            }
        },

        _setCurrentUser: function(dataModel) {
            if(dataModel) {
                var user = dataModel.getProperty("/Users")[0]; // TODO: as long as this is strictly a local task tracker, no need to handle multiple users

                dataModel.setProperty("/Temp/CurrentUser", jsUtils.Object.clone(user));
            }
        }
    });

    return component;
});
