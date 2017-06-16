sap.ui.define([
    "sap/ui/base/Object",
    "../model/Templater",
    "./IdManager"
], function(BaseSapObject, Templater, IdManager) {
	"use strict";

    return BaseSapObject.extend("com.tasky.manager.DataManager", {
        _oDataModel: null,
        _oTemplater: Templater,
        _oIdManager: null,

        _initializeWorkingArea: function(){
            this._oDataModel.setProperty("/Temp", {
                SelectedTask: null,
                SelectedTaskPath: "",
                CurrentUser: null
            });
        },

        _expandDataReferences: function(data){

        },

        _flattenDataReferences: function(data){

        },

        initialize: function(inputModel, jsonData){
            if(inputModel){
                this._oDataModel = inputModel;
            }

            this._oIdManager = new IdManager();
            this._oIdManager.initialize(this._oDataModel);
        },

        createTask: function(){
            var newTask = this._oTemplater.Task();

            newTask.id = this._oIdManager.getNextTaskId();
            newTask.title = "New Task";
            newTask.dateCreated = new Date();
            newTask.dateLastUpdated = new Date();
            newTask.owner = this._oDataModel.getProperty("/Temp/CurrentUser");

            var tasks = this._oDataModel.getProperty("/Tasks");
            tasks.push(newTask);
            this._oDataModel.setProperty("/Tasks", tasks);

            return newTask;
        },

        deleteTask: function(bindingPath){
            var index = bindingPath.split("/");
            index = index[index.length - 1];

            var tasks = this._oDataModel.getProperty("/Tasks");
            tasks.splice(index, 1);
            this._oDataModel.setProperty("/Tasks", tasks);
        },

        addComment: function(text){

        },

        addTodo: function(text){

        }
    });
});
