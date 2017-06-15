sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "../model/Templater",
    "../model/Formatter"
], function(BaseController, MessageToast, MessageBox, Templater, Formatter){
    "use strict";

    return BaseController.extend("com.tasky.controller.MyTaskList", {
        _oTemplater: Templater,
        _oFormatter: Formatter,

        _oTaskList: null,

        onInit: function(){
            this._oTaskList = this.byId("taskList");
        },

        _createTask: function(){
            var newTask = this._oTemplater.Task();

            newTask.id = this.getOwnerComponent().getIdManager().getNextTaskId();
            newTask.dateCreated = new Date();
            newTask.dateLastUpdated = new Date();
            newTask.owner = this.getView().getModel().getProperty("/Temp/CurrentUser");

            return newTask;
        },

        _deleteTask: function(bindingPath){
            var index = bindingPath.split("/");
            index = index[index.length - 1];

            var tasks = this.getView().getModel().getProperty("/Tasks");
            tasks.splice(index, 1);
            this.getView().getModel().setProperty("/Tasks", tasks);
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
            var newTask = this._createTask();

            console.log(newTask);

            var tasks = this.getView().getModel().getProperty("/Tasks");
            tasks.push(newTask);
            this.getView().getModel().setProperty("/Tasks", tasks);
        },

        onPressDeleteTask: function(oEvent) {
            var i18nModel = this.getView().getModel("i18n");

            if(this._oTaskList.getSelectedItem() === null){
                MessageToast.show(i18nModel.getProperty("GENERAL.NOTIFICATIONS.SELECT_A_TASK"));
            }

            var bindingPath = this._oTaskList.getSelectedItem().getBindingContextPath();
            var taskTitle = this.getView().getModel().getProperty(bindingPath).title;
            MessageBox.confirm(i18nModel.getResourceBundle().getText("GENERAL.NOTIFICATIONS.CONFIRM_DELETE_TASK", [taskTitle]), {
                title: i18nModel.getProperty("GENERAL.NOTIFICATIONS.CONFIRMATION"),
                onClose: function(sBindingPath, sAction){
                    if(sAction === MessageBox.Action.OK){
                        this._deleteTask(sBindingPath);
                    }
                }.bind(this, bindingPath)
            });
        }
    });
});
