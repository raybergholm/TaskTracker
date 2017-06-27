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

        onPressTaskDetail: function() {
            var router = this.getRouter();
            if(router) {
                router.navTo("Tasks");
            } else {
                console.error("Router reference not found");
            }
        },

        onPressStatusOverview: function() {},

        onPressSettings: function() {
            var router = this.getRouter();
            if(router) {
                router.navTo("UserSettings");
            } else {
                console.error("Router reference not found");
            }
        }
    });
});
