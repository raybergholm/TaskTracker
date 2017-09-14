sap.ui.define([
    "./BaseController"
], function(BaseController) {
    "use strict";

    return BaseController.extend("com.tasky.controller.Root", {
        onInit: function() {
            BaseController.prototype.onInit.apply(this, arguments);
        }
    });
});
