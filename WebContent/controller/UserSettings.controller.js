sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(BaseController, MessageToast, MessageBox){
    "use strict";

    return BaseController.extend("com.tasky.controller.UserSettings", {

        _setCurrentUser: function(dataModel){
            if(dataModel){
                var user = dataModel.getProperty("/Users")[0]; // TODO: as long as this is strictly a local task tracker, no need to handle multiple users
                dataModel.setProperty("/Temp/CurrentUser", jsUtils.Object.clone(user));
            }
        },

        _deleteLocalDataCallback: function(){
            var i18nModel = this.getView().getModel("i18n");
            var success = this.getOwnerComponent().clearData();
            if(success) {
                MessageToast.show(i18nModel.getProperty("NOTIFICATIONS.DELETE_COMPLETE"));
            } else {
                MessageBox.error(i18nModel.getProperty("NOTIFICATIONS.DELETE_FAILED"), {
                    title: i18nModel.getProperty("NOTIFICATIONS.CRITICAL_ERROR_TITLE")
                });
            }
        },

        _importData: function(jsonData){

            MessageToast.show(this.getView().getModel("i18n").getProperty("NOTIFICATIONS.IMPORT_COMPLETE"));
        },

        _exportData: function(destination){

            MessageToast.show(this.getView().getModel("i18n").getProperty("NOTIFICATIONS.EXPORT_COMPLETE"));
        },

        onInit: function(){
            var selfNavButton = this.byId("settingsNavButton");
            if(selfNavButton){
                selfNavButton.setType(sap.m.ButtonType.Emphasized);
            }
        },

        onPressClearAll: function(oEvent){
            var i18nModel = this.getView().getModel("i18n");

            MessageBox.confirm(i18nModel.getProperty("NOTIFICATIONS.CONFIRM_DELETE_ALL"), {
                title: i18nModel.getProperty("NOTIFICATIONS.CONFIRMATION"),
                onClose: function(sAction){
                    if(sAction === MessageBox.Action.OK){
                        this._deleteLocalDataCallback();
                    }
                }.bind(this)
            });
        },

        onTypeMismatch: function(oEvent){
            MessageToast.show(this.getView().getModel("i18n").getProperty("NOTIFICATIONS.ONLY_JSON_ALLOWED"));
        },

        onChangeFile: function(oEvent){
            console.log(oEvent);
        },

        onUploadComplete: function(oEvent){
            console.log(oEvent);
        },

        onPressImport: function(oEvent){
            var i18nModel = this.getView().getModel("i18n");

            MessageBox.confirm(i18nModel.getProperty("NOTIFICATIONS.CONFIRM_IMPORT"), {
                title: i18nModel.getProperty("NOTIFICATIONS.CONFIRMATION"),
                onClose: function(sAction){
                    if(oEvent){
                        console.log(oEvent);
                    }
                }.bind(this)
            });
        },

        onPressExport: function(oEvent){

        },

        onPressForceSync: function(oEvent){
            // while we're working locally, that just means trigger a full save action so that the local storage is definitely saved.
            this.getOwnerComponent().saveData();
        },

        onPressSave: function(oEvent){
            var dataModel = this.getView().getModel();
            if(!dataModel){
                return;
            }

            var workarea = dataModel.getProperty("/Temp");
            workarea.CurrentUser;

            dataModel.setProperty("/Users/0", workarea.CurrentUser); // NOTE: If this ever gets upgraded to support multiple users, this part clearly needs changing

            this._setCurrentUser(dataModel); // disconnect the references again

            MessageToast.show(this.getView().getModel("i18n").getProperty("NOTIFICATIONS.SETTINGS_SAVED"));
        },

        onPressDebugCreateError: function(){
            undeclaredVar = 1;
        },

        onPressTaskDetail: function(oEvent) {
            var router = this.getOwnerComponent().getRouter();
            if(router){
                router.navTo("Tasks");
            }else {
                console.error("Router reference not found");
            }
        },

        onPressStatusOverview: function(oEvent) {
            var router = this.getOwnerComponent().getRouter();
            if(router){
                router.navTo("Overview");
            }else {
                console.error("Router reference not found");
            }
        },

        onPressSettings: function(oEvent) { }
    });
});
