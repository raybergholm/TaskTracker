sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "../model/Formatter"
], function(BaseController, MessageToast, Formatter) {
    "use strict";

    return BaseController.extend("com.tasky.controller.TaskDetail", {
        _oFormatter: Formatter,

        onInit: function() {
            BaseController.prototype.onInit.apply(this, arguments);

            var selfNavButton = this.byId("taskDetailNavButton");
            if(selfNavButton) {
                selfNavButton.setType(sap.m.ButtonType.Emphasized);
            }
        },

        clearForm: function() {
            this.getApplication().clearCurrentlySelectedTask();
        },

        onPressSave: function() {
            this.getApplication().updateSelectedTask();

            MessageToast.show(this.getModel("i18n").getProperty("NOTIFICATIONS.TASK_SAVED"));
        },

        onSelectTodoCheckBox: function() {
            // TODO: any way to make a pretty strikethrough/faded text when checked?
        },

        onPostTodo: function(oEvent) {
            var text = oEvent.getParameter("value");
            this.getApplication().addTodo(text);
        },

        onPostComment: function(oEvent) {
            var text = oEvent.getParameter("value");
            this.getApplication().addComment(text);
        },

        onUpdateFinishedComments: function(oEvent) {
            var timestamp;
            var items = oEvent.getSource().getItems();
            var workareaModel = this.getModel("workarea");

            for(var i = 0; i < items.length; i++) {
                // Same issue and comment as the equiv found in MyTaskList.onUpdateFinishedTaskList
                timestamp = new moment(workareaModel.getProperty(items[i].getBindingContextPath()).dateCreated);
                if(timestamp.isValid()) {
                    items[i].setTimestamp(timestamp.fromNow());
                }
            }
        },

        onPressTaskDetail: function() {},

        onPressStatusOverview: function() {
            var router = this.getRouter();
            if(router) {
                router.navTo("Overview");
            } else {
                console.error("Router reference not found");
            }
        },

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
