sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/UIComponent",
    "./Application"
], function(jQuery, BaseUIComponent, Application) {
    "use strict";

    return BaseUIComponent.extend("com.tasky.Component", {
        _sContentDensityClassCozy: "sapUiSizeCozy",
        _sContentDensityClassCompact: "sapUiSizeCompact",

        _sContentDensityClass: null,

        _oApplication: null,
        getApplication: function() {
            return this._oApplication;
        },

        metadata: {
            manifest: "json",
        },

        getContentDensityClass : function() {
            if (!this._sContentDensityClass) {
                this._sContentDensityClass = sap.ui.Device.support.touch ? this._sContentDensityClassCozy : this._sContentDensityClassCompact;
            }
            return this._sContentDensityClass;
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

            this._oApplication = new Application();
            this._oApplication.initialize(this, standardApplication);

            console.log("Component init OK");
        }
    });
});
