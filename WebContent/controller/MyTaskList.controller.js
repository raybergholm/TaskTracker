sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(BaseController){
    "use strict";

    return BaseController.extend("com.tasky.controller.MyTaskList", {
        // Extend this controller as required
        //

        onSelectTask: function(evt) {
            var bindingPath = evt.getSource().getSelectedItem().getBindingContextPath();
            var selectedTask = this.getView().getModel().getProperty(bindingPath);


        },

        onUpdateStarted: function(evt) {
            if(evt.getSource()) {
                evt.getSource().setBusy(true);
            }
        },

        onUpdateFinished: function(evt) {
            if(evt.getSource()){
                evt.getSource().setBusy(false);
            }
        },

        onPressNewTask: function(evt) {
            // user wants a new task

            var newTask = new Task();
        },

        onPressDeleteTask: function(evt) {

        }
    });
});
