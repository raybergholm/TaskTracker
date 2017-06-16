sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "../model/Formatter"
], function(BaseController, MessageToast, MessageBox, Formatter){
    "use strict";

    return BaseController.extend("com.tasky.controller.MyTaskList", {
        _oFormatter: Formatter,

        _oTaskList: null,

        _deleteTaskCallback: function(bindingPath){
            this.getOwnerComponent().getDataManager().deleteTask(bindingPath);

            var detailView = this.getOwnerComponent().getView("TaskDetail");
            if(detailView){
                if(this.__oTaskList && _oTaskList.getSelectedItem() !== null){
                    var newBinding = _oTaskList.getSelectedItem().getBindingContextPath();
                    detailView.getController().bindTaskForm(newBinding);
                }else{
                    detailView.getController().clearForm();
                }
            }
        },

        onInit: function(){
            this._oTaskList = this.byId("taskList");
            if(this._oTaskList){
                this._oTaskList.setSelectedItem(this._oTaskList.getItems()[0]);
            }
        },

        onSelectTask: function(oEvent) {
            var bindingPath = oEvent.getSource().getSelectedItem().getBindingContextPath();

            var detailView = this.getOwnerComponent().getView("TaskDetail");
            if(detailView){
                detailView.getController().bindTaskForm(bindingPath);
            }

            var router = this.getOwnerComponent().getRouter();
            if(router){
                router.navTo("Tasks");
            }else {
                console.error("Router reference not found");
            }
        },

        onUpdateStarted: function(oEvent) {
            oEvent.getSource() && oEvent.getSource().setBusy(true);
        },

        onUpdateFinishedTaskList: function(oEvent) {
            var timestamp, status, state;
            oEvent.getSource() && oEvent.getSource().setBusy(false);

            var items = oEvent.getSource().getItems();

            for(var i = 0; i < items.length; i++){
                // This is really ugly having to manually assign things like this, but any attempt to bind & use them
                // the proper way causes data to get overwritten so we will lose the correct values immediately on save.
                // That would be absolutely the wrong behaviour so we don't want that.
                timestamp = new moment(this.getView().getModel().getProperty(items[i].getBindingContextPath()).dateLastUpdated);
                if(timestamp.isValid()){
                    items[i].getAttributes()[1].setText(timestamp.fromNow());
                }

                status = items[i].getFirstStatus();

                switch(status.getText()){
                    case "completed":
                        state = sap.ui.core.ValueState.Success;
                        break;
                    case "inprogress":
                        state = sap.ui.core.ValueState.Warning;
                        break;
                    case "inprogress":
                        state = sap.ui.core.ValueState.Error;
                        break;
                    default:
                        state = sap.ui.core.ValueState.None;
                        break;
                }
                status.setState(state);
            }
        },

        onPressNewTask: function(oEvent) {
            var newTask = this.getOwnerComponent().getDataManager().createTask();

            this._oTaskList.setSelectedItem(this._oTaskList.getItems()[this._oTaskList.getItems().length - 1]); // TODO: does this work? is the ref already updated at this point?
        },

        onPressDeleteTask: function(oEvent) {
            var i18nModel = this.getView().getModel("i18n");

            if(this._oTaskList.getSelectedItem() === null){
                MessageToast.show(i18nModel.getProperty("NOTIFICATIONS.SELECT_A_TASK"));
            }

            var bindingPath = this._oTaskList.getSelectedItem().getBindingContextPath();
            var taskTitle = this.getView().getModel().getProperty(bindingPath).title;
            MessageBox.confirm(i18nModel.getResourceBundle().getText("NOTIFICATIONS.CONFIRM_DELETE_TASK", [taskTitle]), {
                title: i18nModel.getProperty("NOTIFICATIONS.CONFIRMATION"),
                onClose: function(sBindingPath, sAction){
                    if(sAction === MessageBox.Action.OK){
                        this._deleteTaskCallback(sBindingPath);
                    }
                }.bind(this, bindingPath)
            });
        }
    });
});
