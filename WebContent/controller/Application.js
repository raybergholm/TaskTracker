sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Text",
    "sap/m/TextArea"
    "./manager/AppDataManager",
    "./manager/PersistenceManager"
], function(BaseSapObject, MessageToast, MessageBox, AppDataManager, PersistenceManager) {
	"use strict";

    return BaseSapObject.extend("com.tasky.controller.Application", {
        _oComponent: null,
        _oLocalisationModel: null,

        // these are the sort of thing which could be moved to _oApplication. Maybe it needs to be a custom class, tbh since we're barely using the built-in app for anything
        _oViews: {},
        getView: function(sViewId) {
            return this._oViews.hasOwnProperty(sViewId) ? this._oViews[sViewId] : null;
        },
        setViews: function(oViews) {
            this._oViews = oViews;
        },

        _oPersistenceManager: null,
        getPersistenceManager: function(){
            return this._oPersistenceManager;
        },

        _oAppDataManager: null,
        getAppDataManager: function(){
            return this._oAppDataManager;
        },

        _initializeMemberObjects: function(){
            this._oPersistenceManager = new PersistenceManager();
            this._oPersistenceManager.initialize();

            this._oAppDataManager = new AppDataManager();
            this._oAppDataManager.initialize({
                main: this.getModel(),
                taskMetaData: this.getModel("taskMetaData"),
                languages: this.getModel("lang")
            });
        },

        _initializeAppKeybindings: function(){
            window.addEventListener("keydown", this._ctrlSOverride().bind(this));
        },

        _ctrlSOverride: function(oEvent) {
            if (oEvent.ctrlKey || oEvent.metaKey) { // metaKey here for the Mac command key, but it also includes the Windows key. So Windows + S is also a key combo, hmm.
                switch (String.fromCharCode(oEvent.which).toLowerCase()) {
                case "s":
                    oEvent.preventDefault();
                    this.saveData();
                    break;
                }
            }
        },

        _initializeGlobalErrorDialog: function(){
            window.addEventListener("error", this._globalErrorCallback);
        },

        _globalErrorCallback: function(eErrorEvent){
            var errorDialog = new Dialog({
                title: "Error",
                type: "Message",
                state: "Error",
                content: [
                    new Text({
                        text: "Error occured!\n" + eErrorEvent.message + "\n" + eErrorEvent.filename + ":" + eErrorEvent.lineno + "," + eErrorEvent.colno
                    }),
                    new TextArea({
                        width: "100%",
                        cols: 6,
                        value: eErrorEvent.error.stack
                    })
                ],
                beginButton: new Button({
                    text: "OK",
                    press: function(){
                        errorDialog.close();
                    }
                }),
                afterClose: function(){
                    errorDialog.destroy();
                }
            });

            errorDialog.open();
        },

        _handleNoDataManager: function(){
            console.error(_oLocalisationModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"));

            MessageBox.error(_oLocalisationModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"), {
                title: _oLocalisationModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
            });
        },

        _handleNoPersistenceManager: function(){
            console.error(_oLocalisationModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"));

            MessageBox.error(_oLocalisationModel.getProperty("NOTIFICATIONS.NO_PERSISTENCE_INTERFACE"), {
                title: _oLocalisationModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
            });
        },

        initialize: function(oParentComponent){
            this._oComponent = oParentComponent;

            this._oLocalisationModel = this._oComponent.getModel("i18n");

            this._initializeMemberObjects();
            this._initializeAppKeybindings();
            this.loadData();

            console.log("Application init OK");
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
            if(!this._oPersistenceManager) {
                this._handleNoPersistenceManager();
                return false;
            }



            var exportableData = this.createExportableData();
            var success = this._oPersistenceManager.save(exportableData);

            if(success) {
                MessageToast.show(_oLocalisationModel.getProperty("NOTIFICATIONS.SAVE_COMPLETE"));
            } else {
                MessageBox.error(_oLocalisationModel.getProperty("NOTIFICATIONS.SAVE_FAILED"), {
                    title: _oLocalisationModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
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
});
