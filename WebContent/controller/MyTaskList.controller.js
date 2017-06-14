sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/Templater"
], function(BaseController, Templater){
    "use strict";

    return BaseController.extend("com.tasky.controller.MyTaskList", {
        onSelectTask: function(oEvent) {
            var bindingPath = oEvent.getSource().getSelectedItem().getBindingContextPath();

            var detailView = this.getOwnerComponent().getView("TaskDetail");
            if(detailView){
                detailView.getController().bindTaskForm(bindingPath);
            }

        },

        onUpdateStarted: function(oEvent) {
            oEvent.getSource() && oEvent.getSource().setBusy(true);
        },

        onUpdateFinished: function(oEvent) {
            oEvent.getSource() && oEvent.getSource().setBusy(false);
        },

        onPressNewTask: function(oEvent) {
            var newTask = Templater.createTask();
            newTask.id = this.getOwnerComponent().getIdManager().getNextTaskId();
            

            console.log(newTask);
        },

        onPressDeleteTask: function(oEvent) {
            console.log(oEvent);
        }
    });
});
