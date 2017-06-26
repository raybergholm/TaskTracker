sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "../model/Formatter"
], function(BaseController, Filter, FilterOperator, MessageToast, MessageBox, Formatter) {
    "use strict";

    return BaseController.extend("com.tasky.controller.MyTaskList", {
        _oFormatter: Formatter,

        _uiTaskList: null,
        _uiSearchSegmentedButton: null,

        _deleteTaskCallback: function(bindingPath) {
            this.getApplication().deleteTask(bindingPath);

            var detailView = this.getApplication().getView("TaskDetail");
            if(detailView) {
                if(this.__uiTaskList && _uiTaskList.getSelectedItem() !== null) {
                    var newBinding = _uiTaskList.getSelectedItem().getBindingContextPath();
                    detailView.getController().bindTaskForm(newBinding);
                } else {
                    detailView.getController().clearForm();
                }
            }
        },

        onInit: function() {
            this._uiTaskList = this.byId("taskList");
            if(this._uiTaskList) {
                this._uiTaskList.setSelectedItem(this._uiTaskList.getItems()[0]);
            }

            this._uiSearchSegmentedButton = this.byId("searchSegmentedButton");
        },

        onChangeTask: function(oEvent) {
            var bindingPath = oEvent.getSource().getSelectedItem().getBindingContextPath();

            var detailView = this.getApplication().getView("TaskDetail");
            if(detailView) {
                detailView.getController().bindTaskForm(bindingPath);
            }
        },

        onPressTask: function(oEvent){
            var router = this.getOwnerComponent().getRouter();
            if(router) {
                router.navTo("Tasks");
            } else {
                console.error("Router reference not found");
            }
        },

        onUpdateStarted: function(oEvent) {
            oEvent.getSource() && oEvent.getSource().setBusy(true);
        },

        onUpdateFinishedTaskList: function(oEvent) {
            var timestamp, objectStatus, state, data;
            oEvent.getSource() && oEvent.getSource().setBusy(false);

            var i18nModel = this.getModel("i18n");
            var taskStatuses = this.getModel("taskMetadata").getProperty("/TaskStatuses");
            var items = oEvent.getSource().getItems();

            for(var i = 0; i < items.length; i++) {
                // This is really ugly having to manually assign things like this, but any attempt to bind & use them
                // the proper way causes data to get overwritten so we will lose the correct values immediately on save.
                // That would be absolutely the wrong behaviour so we don't want that.

                data = this.getModel().getProperty(items[i].getBindingContextPath());

                objectStatus = items[i].getFirstStatus();
                switch(data.status) {
                    case "completed":
                        state = sap.ui.core.ValueState.Success;
                        break;
                    case "inprogress":
                    case "intesting":
                        state = sap.ui.core.ValueState.Warning;
                        break;
                    case "none":
                        state = sap.ui.core.ValueState.Error;
                        break;
                    default:
                        state = sap.ui.core.ValueState.None;
                        break;
                }

                objectStatus.setText(i18nModel.getProperty(data.status)); // fallback: show the status identifier if for some reason it couldn't find the proper label
                for(var j = 0; j < taskStatuses.length; j++) {
                    if(data.status === taskStatuses[j].key) {
                        objectStatus.setText(i18nModel.getProperty(taskStatuses[j].value));
                    }
                }
                objectStatus.setState(state);

                objectStatus = items[i].getSecondStatus();
                timestamp = new moment(data.dateLastUpdated);
                if(timestamp.isValid()) {
                    objectStatus.setText(i18nModel.getProperty("GENERAL.DATE_LAST_UPDATED") + " " + timestamp.fromNow());
                }
            }

            if(items.length > 0 && !oEvent.getSource().getSelectedItem()){
                oEvent.getSource().setSelectedItem(items[0]);
                oEvent.getSource().fireSelectionChange({
                    listItem: items[0]
                });
            }
        },

        onLiveChangeTaskSearch: function(oEvent){
            var searchTerm = oEvent.getParameter("newValue");
            var filters = [];

            var filterField = this._uiSearchSegmentedButton.getSelectedKey();

            // If the value in the search field is not empty, create a new filter array
            if(searchTerm && searchTerm.length > 0) {
                filters.push(new Filter(filterField, FilterOperator.Contains, searchTerm));
            }

            // Filter the list based on the search term. If the search term is empty, the list is reset by filtering on an empty array (which will return the entire list)
            this._uiTaskList.getBinding("items").filter(filters, filterField);
        },

        onPressNewTask: function(oEvent) {
            this.getApplication().createTask();

            var newTaskInList = this._uiTaskList.getItems()[this._uiTaskList.getItems().length - 1];
            this._uiTaskList.setSelectedItem(newTaskInList);
            this._uiTaskList.fireSelectionChange({
                listItem: newTaskInList
            });
        },

        onPressDeleteTask: function(oEvent) {
            var i18nModel = this.getView().getModel("i18n");

            if(this._uiTaskList.getSelectedItem() === null) {
                MessageToast.show(i18nModel.getProperty("NOTIFICATIONS.SELECT_A_TASK"));
            }

            var bindingPath = this._uiTaskList.getSelectedItem().getBindingContextPath();
            var taskTitle = this.getModel().getProperty(bindingPath).title;
            MessageBox.confirm(i18nModel.getResourceBundle().getText("NOTIFICATIONS.CONFIRM_DELETE_TASK", [taskTitle]), {
                title: i18nModel.getProperty("NOTIFICATIONS.CONFIRMATION"),
                onClose: function(sBindingPath, sAction) {
                    if(sAction === MessageBox.Action.OK) {
                        this._deleteTaskCallback(sBindingPath);
                    }
                }.bind(this, bindingPath)
            });
        }
    });
});
