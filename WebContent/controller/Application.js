sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/TextArea",
    "../manager/AppDataManager",
    "../manager/PersistenceManager"
], function(BaseSapObject, MessageToast, MessageBox, Dialog, Button, Text, TextArea, AppDataManager, PersistenceManager) {
    "use strict";

    return BaseSapObject.extend("com.tasky.controller.Application", {
        _oComponent: null,
        _oLocalisationModel: null,

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
                i18n: this._oLocalisationModel
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

        _initializeGlobalErrorDialog: function() {
            this.attachGlobalErrorDialog();
        },

        _globalErrorCallback: function(eErrorEvent) {
            var errorDialog = new Dialog({
                title: this._oLocalisationModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE"),
                type: "Message",
                state: "Error",
                content: [
                    new Text({
                        text: this._oLocalisationModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_MESSAGE")
                    }),
                    new Text({
                        text: eErrorEvent.message
                    }),
                    new Text({
                        text: eErrorEvent.filename + ":" + eErrorEvent.lineno + "," + eErrorEvent.colno
                    }),
                    new TextArea({
                        width: "100%",
                        rows: 10,
                        value: eErrorEvent.error.stack
                    })
                ],
                beginButton: new Button({
                    text: this._oLocalisationModel.getProperty("ACTIONS.OK"),
                    press: function() {
                        errorDialog.close();
                    }
                }),
                afterClose: function() {
                    errorDialog.destroy();
                }
            });

            errorDialog.open();
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
            this._initializeGlobalErrorDialog();
            this.loadData();

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
                this._oAppDataManager.setMockData();
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

            var success = this._oPersistenceManager.clear();
            if(success) {
                MessageToast.show(this._oLocalisationModel.getProperty("NOTIFICATIONS.DELETE_COMPLETE"));
            } else {
                MessageBox.error(this._oLocalisationModel.getProperty("NOTIFICATIONS.DELETE_FAILED"), {
                    title: this._oLocalisationModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
                });
            }
        },

        clearCurrentlySelectedTask: function(){
            this._oAppDataManager.clearSelectedTask();
        },

        createTask: function(){
            this._oAppDataManager.createTask();
        },

        deleteTask: function(sBindingPath){
            this._oAppDataManager.deleteTask(sBindingPath);
        },

        addComment: function(sText){
            this._oAppDataManager.addComment(sText);
        },

        addTodo: function(sText){
            this._oAppDataManager.addTodo(sText);
        },

        attachGlobalErrorDialog: function(){
            window.addEventListener("error", this._globalErrorCallback.bind(this));
        },

        detachGlobalErrorDialog: function(){
            window.removeEventListener("error", this._globalErrorCallback);
        }
    });
});
