sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(BaseController, MessageToast){
    "use strict";

    return BaseController.extend("com.tasky.controller.App", {
        // Extend this controller as required

        onPressTaskOverview: function(evt){
            MessageToast.show("Task overview button pressed");
        },
        onPressStatusOverview: function(evt){
            MessageToast.show("Status overview button pressed");
        },
        onPressSettings: function(evt){
            MessageToast.show("Settings button pressed");
        }
    });
});
