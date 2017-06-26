// TODO: This class bloated out a fair bit. Maybe abstract out the data format and file handling some more?

sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/UIComponent",
    "./controller/Application"
], function(jQuery, BaseUIComponent, TaskyApplication) {
    "use strict";

    return BaseUIComponent.extend("com.tasky.Component", {
        _oTaskyApplication: null,
        getApplication: function() {
            return this._oTaskyApplication;
        },

        metadata: {
            manifest: "json",
        },
        createContent: function() {
            return sap.ui.view({
                id: "Tasky",
                viewName: "com.tasky.view.Root",
                type: sap.ui.core.mvc.ViewType.XML,
                viewData: {
                    component: this
                }
            });
        },

        init: function() {
            BaseUIComponent.prototype.init.apply(this, arguments);

            if(this.getRouter()) {
                try {
                    this.getRouter().initialize();
                } catch(ex) {
                    console.error(ex);
                }
            }

            var standardApplication = this.getRootControl().byId("TaskyApp");

            this._oTaskyApplication = new TaskyApplication();
            this._oTaskyApplication.initialize(this, standardApplication);

            console.log("Component init OK");
        }
    });
});
