// TODO: This class bloated out a fair bit. Maybe abstract out the data format and file handling some more?

sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "./manager/AppDataManager",
    "./manager/PersistenceManager"
], function(jQuery, BaseUIComponent, MessageToast, MessageBox, AppDataManager, PersistenceManager) {
    "use strict";

    var component = BaseUIComponent.extend("com.tasky.Component", {
        _MOCK_LOCAL_MODEL_JSON: "/mockData.json",
        _TASK_META_MODEL_JSON: "/taskMetadata.json",
        _LANGUAGE_MODEL_JSON: "/languages.json",

        _oApplication: null,
        _oCustomApplication: null,
        getApplication: function(){
            return this._oCustomApplication;
        },

        // these are the sort of thing which could be moved to _oApplication. Maybe it needs to be a custom class, tbh since we're barely using the built-in app for anything
        _oViews: {},
        getView: function(sViewId) {
            return this._oViews.hasOwnProperty(sViewId) ? this._oViews[sViewId] : null;
        },

        _oPersistenceManager: null,
        getPersistenceManager: function(){
            return this._oPersistenceManager;
        },

        _oAppDataManager: null,
        getAppDataManager: function(){
            return this._oAppDataManager;
        },

        metadata: {
            manifest: "json",
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

        _initializeManagers: function(){
            this._oPersistenceManager = new PersistenceManager();
            this._oPersistenceManager.initialize();

            this._oAppDataManager = new AppDataManager();
            this._oAppDataManager.initialize({
                main: this.getModel(),
                taskMetaData: this.getModel("taskMetaData"),
                languages: this.getModel("lang")
            });
        },

        _handleNoDataManager: function(){
            var i18nModel = this.getModel("i18n");

            console.error(i18nModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"));

            MessageBox.error(i18nModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"), {
                title: i18nModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
            });
        },

        _handleNoPersistenceManager: function(){
            var i18nModel = this.getModel("i18n");

            console.error(i18nModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"));

            MessageBox.error(i18nModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"), {
                title: i18nModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
            });
        },

        _initializeKeybindings: function(){
            this._overrideCtrlS(); // ctrl+S save functionality (I think this should work for Macs too? No Mac for me to test though)
        },

        _overrideCtrlS: function(){
            window.addEventListener("keydown", function(oEvent) {
                if (oEvent.ctrlKey || oEvent.metaKey) {
                    switch (String.fromCharCode(oEvent.which).toLowerCase()) {
                    case "s":
                        oEvent.preventDefault();
                        this.saveData();
                        break;
                    }
                }
            }.bind(this));
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

            // TODO: actually, pretty much everything past this point could be considered application code

            var i18nModel = this.getModel("i18n");
            if(i18nModel) {
                var rng = Math.round((Math.random() * 2) + 1);
                var randomQuip = i18nModel.getProperty("GENERAL.PAGE.QUIP" + rng)

                document.title = i18nModel.getResourceBundle().getText("GENERAL.PAGE.TITLE", [randomQuip]);
            }

            var taskMetadataModel = this.getModel("taskMetadata");
            if(taskMetadataModel) {
                taskMetadataModel.attachEvent("requestCompleted", function(oEvent) {
                    this._updateTaskMetadataLabels(); // TODO: I'd really like to move this inside AppDataManager, but it really shouldn't know about translations
                }.bind(this));
            }

            // var dataModel = this.getModel();
            // if(dataModel) {
            //     dataModel.attachEvent("requestCompleted", function(oEvent) {
            //         this._initialDataSetup();
            //     }.bind(this));
            // }

            this._initializeManagers();

            this._initializeKeybindings();

            this._oViews = this._createViewMap();

            this.loadData();

            console.log("Component init OK");
        },

        loadData: function(){
            if(!this._oPersistenceManager) {
                this._handleNoPersistenceManager();
                return;
            }

            var data = this._oPersistenceManager.load();
            if(data){
                this._oAppDataManager.setData(data);
            }else {
                this._oAppDataManager.setMockData();
            }
        },

        saveData: function() {
            var i18nModel = this.getModel("i18n");

            if(!this._oPersistenceManager) {
                this._handleNoPersistenceManager();
                return false;
            }

            var exportableData = this.createExportableData();
            var success = this._oPersistenceManager.save(exportableData);

            if(success) {
                MessageToast.show(i18nModel.getProperty("NOTIFICATIONS.SAVE_COMPLETE"));
            } else {
                MessageBox.error(i18nModel.getProperty("NOTIFICATIONS.SAVE_FAILED"), {
                    title: i18nModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
                });
            }

        },

        clearData: function(){
            var i18nModel = this.getModel("i18n");

            if(!this._oPersistenceManager) {
                this._handleNoPersistenceManager();
                return false;
            }

            return this._oPersistenceManager.clear();
        },

        createExportableData: function() { // clone data, format dates and flatten refs down to IDs
            return this._oAppDataManager.createExportableData();
        }
    });

    return component;
});
