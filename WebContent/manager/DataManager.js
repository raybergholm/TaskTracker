sap.ui.define([
    "sap/ui/base/Object",
    "../model/Templater"
], function(BaseSapObject, Templater) {
	"use strict";

    // This class handles changes to the local JSON model
    return BaseSapObject.extend("com.tasky.manager.DataManager", {
        _oDataModel: null,
        _oTemplater: Templater,

        _initializeWorkingArea: function(){
            if(!this._oDataModel){
                this._handleNoModelException();
            }

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

        _getNextId: function(haystack){
            var maxId = 0;
            if(haystack){
                for(var i = 0; i < haystack.length; i++){
                    if(maxId < haystack[i].id){
                        maxId = parseInt(haystack[i].id, 10);
                    }
                }
            }
            return ++maxId;
        },

        _handleNoModelException: function(){
            throw new Error("DataManager has no model reference! Did you miss an .initialize() call?");
        },

        initialize: function(inputModel, jsonData){
            if(inputModel){
                this._oDataModel = inputModel;
            }
        },

        clearSelectedTask: function(){
            if(!this._oDataModel){
                this._handleNoModelException();
            }

            var workarea = this._oDataModel.getProperty("/Temp");
            workarea.SelectedTask = {};
            workarea.SelectedTaskPath = "";
            this._oDataModel.setProperty("/Temp", workarea);
        },

        createTask: function(){
            if(!this._oDataModel){
                this._handleNoModelException();
            }

            var newTask = this._oTemplater.Task();

            newTask.id = this.getNextTaskId();
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
            if(!this._oDataModel){
                this._handleNoModelException();
            }

            var index = bindingPath.split("/");
            index = index[index.length - 1];

            var tasks = this._oDataModel.getProperty("/Tasks");
            tasks.splice(index, 1);
            this._oDataModel.setProperty("/Tasks", tasks);
        },

        addComment: function(text){
            if(!this._oDataModel){
                this._handleNoModelException();
            }

            var newComment = this._oTemplater.Comment();
            newComment.id = this.getNextCommentId();
            newComment.dateCreated = new Date();
            newComment.dateLastUpdated = new Date();
            newComment.owner = this._oDataModel.getProperty("/Temp/CurrentUser");
            newComment.text = text;

            var workingarea = this._oDataModel.getProperty("/Temp");
            workingarea.SelectedTask.comments.push(newComment);
            this._oDataModel.setProperty("/Temp", workingarea);
        },

        addTodo: function(text){
            if(!this._oDataModel){
                this._handleNoModelException();
            }

            var newTodo = this._oTemplater.Todo();
            newTodo.id = this.getNextTodoId();
            newTodo.text = text;

            var workingarea = this._oDataModel.getProperty("/Temp");
            workingarea.SelectedTask.todos.push(newTodo);
            this._oDataModel.setProperty("/Temp", workingarea);

        },

        getNextTaskId: function(){
            return this._getNextId(this._oDataModel.getProperty("/Tasks"));
        },

        getNextCommentId: function(){
            return this._getNextId(this._oDataModel.getProperty("/Comments"));
        },

        getNextTodoId: function(){
            return this._getNextId(this._oDataModel.getProperty("/Todos"));
        }
    });
});
