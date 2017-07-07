sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
], function(BaseController, MessageToast) {
    "use strict";

    return BaseController.extend("com.tasky.controller.StatusOverview", {

        _mCategories: {
            Status: "status",
            ProjectCode: "projectCode",
            Priority: "priority",
            LastUpdated: "lastUpdated"
        },

        onInit: function() {
            var selfNavButton = this.byId("overviewNavButton");
            if(selfNavButton) {
                selfNavButton.setType(sap.m.ButtonType.Emphasized);
            }
        },

        onSelectCategory: function(oEvent){
            var selectedKey = oEvent.getParameter("key");
            this.getApplication().setCategoryGroupings(selectedKey);
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
