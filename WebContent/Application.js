sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "./manager/AppDataManager",
    "./manager/PersistenceManager"
], function(BaseSapObject, MessageToast, MessageBox, AppDataManager, PersistenceManager) {
    "use strict";

    return BaseSapObject.extend("com.tasky.controller.Application", {
        _oComponent: null,
        _oStandardApplication: null,
        _oLocalisationModel: null,

        _fnGlobalEventCallback: null, // this is needed since we need .bind(this), but this act creates a new function ref. So we need to store the ref when we want to remove the old event listener.

        _uiErrorDialog: null,

        getModel: function(sModelId) {
            return this._oComponent.getModel(sModelId);
        },

        _mViews: {},
        getView: function(sViewId) {
            return this._mViews.hasOwnProperty(sViewId) ? this._mViews[sViewId] : null;
        },

        _oPersistenceManager: null,
        _oAppDataManager: null,

        _initializeMemberObjects: function() {
            this._oPersistenceManager = new PersistenceManager();
            this._oPersistenceManager.initialize();

            this._oAppDataManager = new AppDataManager();
            this._oAppDataManager.initialize({
                main: this.getModel(),
                taskMetadata: this.getModel("taskMetadata"),
                languages: this.getModel("lang"),
                i18n: this._oLocalisationModel,
                workarea: this.getModel("workarea")
            });
        },

        _initializeViewMap: function() {
            var pages, i, prop;

            var viewMap = {};
            this._mViews.root = this._oComponent.getRootControl();

            pages = this._oStandardApplication.getMasterPages();
            for(i = 0; i < pages.length; i++) {
                prop = pages[i].getId();
                prop = prop.split("--");
                prop = prop[prop.length - 1];

                this._mViews[prop] = pages[i];
            }

            pages = this._oStandardApplication.getDetailPages();
            for(i = 0; i < pages.length; i++) {
                prop = pages[i].getId();
                prop = prop.split("--");
                prop = prop[prop.length - 1];

                this._mViews[prop] = pages[i];
            }
        },

        _initializeAppKeybindings: function() {
            window.addEventListener("keydown", this._ctrlSOverride.bind(this));
        },

        _ctrlSOverride: function(oEvent) {
            if(oEvent.ctrlKey || oEvent.metaKey) { // metaKey here for the Mac command key, but it also includes the Windows key. So Windows + S is also a key combo, hmm.
                switch(String.fromCharCode(oEvent.which).toLowerCase()) {
                    case "s":
                        oEvent.preventDefault();
                        this.saveData();
                        break;
                }
            }
        },

        _applyUserSettings: function() {
            var currentUser = this._oAppDataManager.getCurrentUser();
            if(currentUser.verboseErrorMode) {
                this.attachGlobalErrorDialog();
            }

            this.changeLanguage(currentUser.language);
        },

        _globalErrorCallback: function(oEvent) {
            this._oComponent.getRootControl().getController().showGlobalErrorDialog(oEvent);
        },

        _createExportableData: function() { // clone data, format dates and flatten refs down to IDs
            return this._oAppDataManager.createExportableData();
        },

        _notifyNoDataManager: function() {
            console.error(this._oLocalisationModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"));

            MessageBox.error(this._oLocalisationModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"), {
                title: this._oLocalisationModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
            });
        },

        _notifyNoPersistenceManager: function() {
            console.error(this._oLocalisationModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"));

            MessageBox.error(this._oLocalisationModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"), {
                title: this._oLocalisationModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
            });
        },

        _firstTimeUserProcess: function() {

        },

        initialize: function(oParentComponent, oStandardApplication) {
            console.log("Application init started");

            this._oComponent = oParentComponent;
            this._oStandardApplication = oStandardApplication;

            this._oLocalisationModel = this._oComponent.getModel("i18n");

            this._initializeMemberObjects();
            this._initializeViewMap();
            this._initializeAppKeybindings();
            this.loadData();

            this._applyUserSettings();

            console.log("Application init OK");
        },

        loadData: function() {
            if(!this._oPersistenceManager) {
                this._notifyNoPersistenceManager();
                return;
            }

            var data = this._oPersistenceManager.load();
            if(data) {
                this._oAppDataManager.setData(data);
            } else {
                this._oAppDataManager.initializeData();
            }
        },

        saveData: function() {
            if(!this._oPersistenceManager) {
                this._notifyNoPersistenceManager();
                return false;
            }

            var exportableData = this._createExportableData();

            var success = this._oPersistenceManager.save(exportableData);
            if(success) {
                MessageToast.show(this._oLocalisationModel.getProperty("NOTIFICATIONS.SAVE_COMPLETE"));
            } else {
                MessageBox.error(this._oLocalisationModel.getProperty("NOTIFICATIONS.SAVE_FAILED"), {
                    title: this._oLocalisationModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
                });
            }

        },

        clearData: function() {
            if(!this._oPersistenceManager) {
                this._notifyNoPersistenceManager();
                return false;
            }

            var success;

            success = this._oPersistenceManager.clear();
            if(!success) {
                return success; // couldn't clear data from the persistence layer, let's not clear the working memory.
            }

            success = this._oAppDataManager.initializeData();
            if(success) {
                MessageToast.show(this._oLocalisationModel.getProperty("NOTIFICATIONS.DELETE_COMPLETE"));
            } else {
                MessageBox.error(this._oLocalisationModel.getProperty("NOTIFICATIONS.DELETE_FAILED"), {
                    title: this._oLocalisationModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
                });
            }
        },

        exportData: function() {
            var exportableData = this._createExportableData();
            if(exportableData) {
                exportableData = JSON.stringify(exportableData);
            }
            var timestamp = new moment();
            var filetype = ".json";
            var filename = this._oLocalisationModel.getProperty("GENERAL.EXPORT_FILENAME") + timestamp.format("_YYYYMMDD_HHmm") + filetype;

            var file = new File([exportableData], filename, {
                type: "text/plain;charset=utf-8"
            });
            saveAs(file);
        },

        importData: function(oFile) {
            var localFileReader = new LocalFileReader({
                callbacks: {
                    readComplete: function(aFiles) {
                        if(!aFiles || aFiles.length === 0 || !aFiles[0].content) {
                            console.error("File read error");
                            return;
                        }

                        var data = JSON.parse(aFiles[0].content);
                        if(!data) {
                            console.error("JSON parse error");
                            return;
                        }
                        this._oAppDataManager.setData(data);
                    }.bind(this)
                }
            });
            localFileReader.readFiles([oFile], LocalFileReader.ReadMode.Text);
        },

        loadMockData: function() {
            this._oAppDataManager.setMockData();
        },

        changeLanguage: function(sLanguageCode) {
            if(!sLanguageCode) {
                sLanguageCode = "en"; // default to English if the input is invalid
            }

            sap.ui.getCore().getConfiguration().setLanguage(sLanguageCode);
        },

        changeSelectedTask: function(sPath) {
            this._oAppDataManager.changeSelectedTask(sPath);
        },

        updateSelectedTask: function() {
            this._oAppDataManager.updateSelectedTask();

            this.saveData();
        },

        clearCurrentlySelectedTask: function() {
            this._oAppDataManager.clearSelectedTask();
        },

        createTask: function() {
            this._oAppDataManager.createTask();
        },

        deleteTask: function(sBindingPath) {
            this._oAppDataManager.deleteTask(sBindingPath);
        },

        addComment: function(sText) {
            this._oAppDataManager.addComment(sText);
        },

        addTodo: function(sText) {
            this._oAppDataManager.addTodo(sText);
        },

        setCategoryGroupings: function(key) {
            this._oAppDataManager.setCategoryGroupings(key);
        },

        updateUserSettings: function() {
            this._oAppDataManager.updateUserSettings();
            this.saveData();
        },

        attachGlobalErrorDialog: function() {
            this.detachGlobalErrorDialog(); // let's be absolutely certain we don't double-register the event listener
            this._fnGlobalEventCallback = this._globalErrorCallback.bind(this);
            window.addEventListener("error", this._fnGlobalEventCallback);
        },

        detachGlobalErrorDialog: function() {
            if(this._fnGlobalEventCallback !== null) {
                window.removeEventListener("error", this._fnGlobalEventCallback);
                this._fnGlobalEventCallback = null;
            }
        }
    });
});
