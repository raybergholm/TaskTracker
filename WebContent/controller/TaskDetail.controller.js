sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(BaseController, MessageToast){
    "use strict";

    return BaseController.extend("com.tasky.controller.TaskDetail", {
        // Extend this controller as required

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

        bindTaskForm: function(sPath){
            var model = this.getView().getModel();
            model.setProperty("/SelectedTask", model.getProperty(sPath));
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

        onCommentPost: function(oEvent) {
            console.log(oEvent);
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
