sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(BaseController, MessageToast){
    "use strict";

    return BaseController.extend("com.tasky.controller.UserSettings", {

        _setCurrentUser: function(dataModel){
            if(dataModel){
                var user = dataModel.getProperty("/Users")[0]; // TODO: as long as this is strictly a local task tracker, no need to handle multiple users

                dataModel.setProperty("/Temp/CurrentUser", jsUtils.Object.clone(user));
            }
        },

        onPressSave: function(oEvent){
            var dataModel = this.getView().getModel();
            if(!dataModel){
                return;
            }

            var workarea = dataModel.getProperty("/Temp");
            workarea.CurrentUser;

            dataModel.setProperty("/Users/0", workarea.CurrentUser);

            this._setCurrentUser(dataModel); // disconnect the references again

            MessageToast.show(this.getView().getModel("i18n").getProperty("GENERAL.NOTIFICATIONS.SETTINGSSAVED"));
        },

        onPressTaskDetail: function(oEvent) {
            MessageToast.show("Task overview button pressed");

            var router = this.getOwnerComponent().getRouter();
            if(router){
                router.navTo("Tasks");
            }else {
                console.error("Router reference not found");
            }
        },

        onPressStatusOverview: function(oEvent) {
            MessageToast.show("Status overview button pressed");

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
