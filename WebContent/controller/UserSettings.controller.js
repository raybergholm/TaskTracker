sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(BaseController, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("com.tasky.controller.UserSettings", {
        _uiFileUploader: null,
        _uiLanguageDropdown: null,

        _setCurrentUser: function(dataModel) {
            if(dataModel) {
                var user = dataModel.getProperty("/Users")[0]; // TODO: as long as this is strictly a local task tracker, no need to handle multiple users
                dataModel.setProperty("/Temp/CurrentUser", jsUtils.Object.clone(user));
            }
        },

        _deleteLocalDataCallback: function() {
            var i18nModel = this.getView().getModel("i18n");
            var success = this.getApplication().clearData();
        },

        onInit: function() {
            var selfNavButton = this.byId("settingsNavButton");
            if(selfNavButton) {
                selfNavButton.setType(sap.m.ButtonType.Emphasized);
            }

            this._uiFileUploader = this.byId("fileUploader");
            this._uiLanguageDropdown = this.byId("languageDropdown");
        },

        onPressClearAll: function() {
            var i18nModel = this.getView().getModel("i18n");

            MessageBox.confirm(i18nModel.getProperty("NOTIFICATIONS.CONFIRM_DELETE_ALL"), {
                title: i18nModel.getProperty("NOTIFICATIONS.CONFIRMATION"),
                onClose: function(sAction) {
                    if(sAction === MessageBox.Action.OK) {
                        this._deleteLocalDataCallback();
                    }
                }.bind(this)
            });
        },

        onTypeMismatch: function() {
            MessageToast.show(this.getView().getModel("i18n").getProperty("NOTIFICATIONS.ONLY_JSON_ALLOWED"));
        },

        onChangeFile: function(oEvent) {
            if(!oEvent.getParameter("files") || oEvent.getParameter("files").length === 0) {
                return;
            }

            var file = oEvent.getParameter("files")[0];
            var i18nModel = this.getModel("i18n");
            MessageBox.confirm(i18nModel.getProperty("NOTIFICATIONS.CONFIRM_OVERWRITE"), {
                title: i18nModel.getProperty("NOTIFICATIONS.CONFIRMATION"),
                onClose: function(oFile, sAction) {
                    if(sAction === MessageBox.Action.OK) {
                        this.getApplication().importData(oFile);
                    }
                }.bind(this, file)
            });
        },

        onPressExport: function() {
            this.getApplication().exportData();
        },

        onPressLoadMockData: function() {
            var i18nModel = this.getModel("i18n");
            MessageBox.confirm(i18nModel.getProperty("NOTIFICATIONS.CONFIRM_OVERWRITE"), {
                title: i18nModel.getProperty("NOTIFICATIONS.CONFIRMATION"),
                onClose: function(sAction) {
                    if(sAction === MessageBox.Action.OK) {
                        this.getApplication().loadMockData();
                    }
                }.bind(this)
            });
        },

        onPressForceSync: function() {
            // while we're working locally, that just means trigger a full save action so that the local storage is definitely saved.
            this.getApplication().saveData();
        },

        onPressSave: function() {
            var dataModel = this.getModel();
            if(!dataModel) {
                return;
            }

            var workarea = dataModel.getProperty("/Temp");
            workarea.CurrentUser;

            dataModel.setProperty("/Users/0", workarea.CurrentUser); // NOTE: If this ever gets upgraded to support multiple users, this part clearly needs changing

            this._setCurrentUser(dataModel); // disconnect the references again

            this.getApplication().saveData();

            MessageToast.show(this.getView().getModel("i18n").getProperty("NOTIFICATIONS.SETTINGS_SAVED"));
        },

        onChangeVerboseErrorMode: function(oEvent) {
            if(oEvent.getParameter("state")){
                this.getApplication().attachGlobalErrorDialog();
            }else{
                this.getApplication().detachGlobalErrorDialog();
            }
        },

        onPressApplyLanguage: function() {
            if(!this._uiLanguageDropdown) {
                return;
            }

            var selectedLanguage = this._uiLanguageDropdown.getSelectedKey();
            this.getApplication().changeLanguage(selectedLanguage);
        },

        onPressDebugCreateError: function() {
            throw new Error("Ce n'est pas une erreur");
        },

        onPressTaskDetail: function() {
            var router = this.getOwnerComponent().getRouter();
            if(router) {
                router.navTo("Tasks");
            } else {
                console.error("Router reference not found");
            }
        },

        onPressStatusOverview: function() {
            var router = this.getOwnerComponent().getRouter();
            if(router) {
                router.navTo("Overview");
            } else {
                console.error("Router reference not found");
            }
        },

        onPressSettings: function() {}
    });
});
