sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(BaseController, MessageToast){
    "use strict";

    return BaseController.extend("com.tasky.controller.Root", {
        _component: null,
        _router: null,

        onInit: function(){
            this._component = this.getOwnerComponent();
            this._router = this._component.getRouter();
        },

        onPressTaskOverview: function(evt){
            MessageToast.show("Task overview button pressed");

            if(this._router){
                this.getOwnerComponent().getRouter().navTo("Tasks");
            }else {
                console.error("Router reference not found");
            }
        },

        onPressStatusOverview: function(evt){
            MessageToast.show("Status overview button pressed");

            if(this._router){
                this._router.navTo("Overview");
            }else {
                console.error("Router reference not found");
            }
        },

        onPressSettings: function(evt){
            MessageToast.show("Settings button pressed");

            if(this._router){
                this._router.navTo("UserSettings");
            }else {
                console.error("Router reference not found");
            }
        }
    });
});
