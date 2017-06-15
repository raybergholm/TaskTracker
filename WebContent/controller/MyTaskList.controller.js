sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/Templater",
    "../model/Formatter"
], function(BaseController, Templater, Formatter){
    "use strict";

    return BaseController.extend("com.tasky.controller.MyTaskList", {
        _oTemplater: Templater,
        _oFormatter: Formatter,

        _createNewTask: function(){
            var newTask = this._oTemplater.Task();
            newTask.id = this.getOwnerComponent().getIdManager().getNextTaskId();
        },

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
            var newTask = this._createNewTask();

            console.log(newTask);

            var tasks = this.getView().getModel().getProperty("/Tasks");
            tasks.push(newTask);
            this.getView().getModel().setProperty("/Tasks", tasks);
        },

        onPressDeleteTask: function(oEvent) {
            console.log(oEvent);
        }
    });
});
