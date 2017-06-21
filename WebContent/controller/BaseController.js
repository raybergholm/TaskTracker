sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(BaseStandardController){
    "use strict";

    // Pretty much every method here are convenience methods for commonly encountered use cases
    return BaseStandardController.extend("com.tasky.controller.BaseController", {
        getApplication: function(){
            return this.getOwnerComponent().getApplication();
        },

		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}
    });
});
