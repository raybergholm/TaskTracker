sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(BaseController){
    "use strict";

    return BaseController.extend("com.tasky.controller.StatusOverview", {
        // Extend this controller as required

        nav: {
            to: function() {
                sap.ui.getCore().byId("app--TaskyApp").to(this.oView);
            }.bind(this),
            from: function() {

            }.bind(this)
        }
    });
});
