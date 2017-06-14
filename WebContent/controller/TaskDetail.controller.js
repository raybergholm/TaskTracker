sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "../model/Templater",
    "../model/Formatter"
], function(BaseController, MessageToast, Templater, Formatter){
    "use strict";

    return BaseController.extend("com.tasky.controller.TaskDetail", {
        _oViewElementIds: {
            taskForm: "taskForm",
            titleInput: "titleField",
            taskStatusDropdown: "taskStatusDropdown",
            ownerDisplay: "ownerDisplay",
            dateCreatedDisplay: "dateCreatedField",
            dateLastUpdatedDisplay: "dateLastUpdatedField",
            descriptionInput: "descriptionField",
            commentsList: "commentsList",
            todoChecklist: "todoChecklist"
        },

        _oTemplater: Templater,
        _oFormatter: Formatter,

        bindTaskForm: function(sPath){ // TODO: this could do with a better name
            var dataModel = this.getView().getModel();

            if(dataModel){
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

        onPressSave: function(oEvent){
            var dataModel = this.getView().getModel();
            if(!dataModel){
                return;
            }

            var workarea = dataModel.getProperty("/Temp");
            workarea.SelectedTask.dateLastUpdated = new Date();

            dataModel.setProperty(workarea.SelectedTaskPath, workarea.SelectedTask);

            this.bindTaskForm(workarea.SelectedTaskPath); // create a new working copy after saving

            MessageToast.show(this.getView().getModel("i18n").getProperty("GENERAL.NOTIFICATIONS.TASKSAVED"));
        },

        onSelectTodoCheckBox: function(oEvent){
            console.log(oEvent);
        },

        onPostTodo: function(oEvent){
            var text = oEvent.getParameter("value");

            var newTodo = this._oTemplater.Todo();
            newTodo.id = this.getOwnerComponent().getIdManager().getNextTodoId();
            newTodo.text = text;

            console.log(newTodo);
        },

        onPostComment: function(oEvent) {
            var text = oEvent.getParameter("value");

            var newComment = this._oTemplater.Comment();
            newComment.id = this.getOwnerComponent().getIdManager().getNextCommentId();
            newComment.text = text;
            newComment.owner = this.getView().getModel().getProperty("Temp/CurrentUser");

            console.log(newComment);
        },

        onUpdateFinishedComments: function(oEvent){
            var timestamp;
            var items = oEvent.getSource().getItems();

            for(var i = 0; i < items.length; i++){
                timestamp = new moment(items[i].getTimestamp());
                if(timestamp.isValid()){
                    items[i].setTimestamp(timestamp.fromNow());
                }
            }
        },

        onPressTaskDetail: function(oEvent){ },

        onPressStatusOverview: function(oEvent){
            MessageToast.show("Status overview button pressed");

            var router = this.getOwnerComponent().getRouter();
            if(router){
                router.navTo("Overview");
            }else {
                console.error("Router reference not found");
            }
        },

        onPressSettings: function(oEvent){
            MessageToast.show("Settings button pressed");

            var router = this.getOwnerComponent().getRouter();
            if(router){
                router.navTo("UserSettings");
            }else {
                console.error("Router reference not found");
            }
        }
    });
});
