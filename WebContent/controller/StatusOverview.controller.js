sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
], function(BaseController, MessageToast) {
    "use strict";

    return BaseController.extend("com.tasky.controller.StatusOverview", {
        onInit: function() {
            var selfNavButton = this.byId("overviewNavButton");
            if(selfNavButton) {
                selfNavButton.setType(sap.m.ButtonType.Emphasized);
            }
        },

        onPressTaskDetail: function(oEvent) {
            var router = this.getOwnerComponent().getRouter();
            if(router) {
                router.navTo("Tasks");
            } else {
                console.error("Router reference not found");
            }
        },

        onPressStatusOverview: function(oEvent) {},

        onPressSettings: function(oEvent) {
            var router = this.getOwnerComponent().getRouter();
            if(router) {
                router.navTo("UserSettings");
            } else {
                console.error("Router reference not found");
            }
        }
    });
});
