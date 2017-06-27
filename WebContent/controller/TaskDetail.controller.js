sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "../model/Formatter"
], function(BaseController, MessageToast, Formatter) {
    "use strict";

    return BaseController.extend("com.tasky.controller.TaskDetail", {
        // _oViewElementIds: {
        //     taskForm: "taskForm",
        //     titleInput: "titleField",
        //     taskStatusDropdown: "taskStatusDropdown",
        //     ownerDisplay: "ownerDisplay",
        //     dateCreatedDisplay: "dateCreatedField",
        //     dateLastUpdatedDisplay: "dateLastUpdatedField",
        //     descriptionInput: "descriptionField",
        //     commentsList: "commentsList",
        //     todoChecklist: "todoChecklist"
        // },

        _oFormatter: Formatter,

        onInit: function() {
            var selfNavButton = this.byId("taskDetailNavButton");
            if(selfNavButton) {
                selfNavButton.setType(sap.m.ButtonType.Emphasized);
            }
        },

        bindTaskForm: function(sPath) { // TODO: this could do with a better name
            var dataModel = this.getModel();

            if(dataModel) {
                var workarea = dataModel.getProperty("/Temp");
                var workingCopy = jsUtils.Object.clone(dataModel.getProperty(sPath));

                workarea.SelectedTask = workingCopy;
                workarea.SelectedTaskPath = sPath;

                dataModel.setProperty("/Temp", workarea);
            }
        },

        /**
         * FIXME: The method below would be a more elegant way of fixing data binding than having
         * to copy bindings around the place to /Selected paths since copying things run the risk of creating accidental duplicates and errors
         * propagating changes, not to mention it's just ugly. But for some reason SAPUI5's own functionality can't do it so that's pretty damn stupid.
         */
        // bindTaskForm: function(sPath){
        //     var element;
        //
        //     this.getView().getContent()[0].bindElement(sPath); // doesn't work
        //
        //     var taskForm = this.byId(this._oViewElementIds.taskForm);
        //     if(taskForm){
        //         taskForm.bindElement(sPath); // doesn't work either
        //     }else{
        //         console.error("task form couldn't be bound");
        //     }
        //
        //     for(var entry in this._oViewElementIds){
        //         element = this.byId(this._oViewElementIds[entry]);
        //         if(element){
        //             element.bindElement(sPath); // doesn't work even when applied on itself?!
        //         }else{
        //             console.error("" + this._oViewElementIds[entry] + " element not found!");
        //         }
        //     }
        // },

        clearForm: function() {
            this.getApplication().clearCurrentlySelectedTask();
        },

        onPressSave: function() {
            var dataModel = this.getModel();
            if(!dataModel) {
                return;
            }

            var workarea = dataModel.getProperty("/Temp");
            workarea.SelectedTask.dateLastUpdated = new Date();

            dataModel.setProperty(workarea.SelectedTaskPath, workarea.SelectedTask);

            this.bindTaskForm(workarea.SelectedTaskPath); // create a new working copy after saving

            this.getApplication().saveData();

            MessageToast.show(this.getView().getModel("i18n").getProperty("NOTIFICATIONS.TASK_SAVED"));
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

            for(var i = 0; i < items.length; i++) {
                // Same issue and comment as the equiv found in MyTaskList.onUpdateFinishedTaskList
                timestamp = new moment(this.getModel().getProperty(items[i].getBindingContextPath()).dateCreated);
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
