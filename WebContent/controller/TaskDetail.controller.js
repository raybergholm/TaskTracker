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
            var element;
            var taskForm = this.byId(this._oViewElementIds.taskForm);
            if(taskForm){
                taskForm.bindElement(sPath);
            }else{
                console.error("task form couldn't be bound");
            }

            for(var entry in this._oViewElementIds){
                element = this.byId(this._oViewElementIds[entry]);
                if(element){
                    element.bindElement(sPath);
                }else{
                    console.error("" + this._oViewElementIds[entry] + " element not found!");
                }
            }
        },

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
