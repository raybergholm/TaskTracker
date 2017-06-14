sap.ui.define([
    "sap/ui/base/Object"
], function(BaseSapObject) {
	"use strict";

    var objInstance = BaseSapObject.extend("com.tasky.manager.IdManager", {});

    // NOTE: These are here because we're using Templater as a factory, so these methods should be static.
    // There's no point in requiring an instance of Templater just to create data structs from templates
    objInstance.createTask = function(){
        return {
            id: null,
            status: "none",
            icon: "",
            title: "",
            description: "",
            dateCreated: new Date(),
            dateLastUpdated: new Date(),
            owner: "",
            comments: [],
            todos: []
        };
    };

    objInstance.createComment = function(){
        return {
            id: null,
            dateCreated: new Date(),
            dateLastUpdated: new Date(),
            owner: "",
            text: ""
        };
    };

    objInstance.createTodo = function(){
        return {
            text: "",
            isDone: false,
            valueState: "None"
        };
    };

    return objInstance;
});


function TaskManager() {
    this._tasks = [];

    this.getNextId = function() {

    };

    this.getTask = function(id) {
        return this._tasks[task.id] || null;
    };

    this.getTasks = function() {
        return this._tasks;
    };

    this.setTask = function(task) {
        if(!this._tasks[task.id]){
            this._tasks[task.id] = task;
        } else {
            console.error("Tried to add a duplicate task.");
        }
    };

    this.updateTask = function(task) {
        // TODO: wait, might be pretty unnecessary if get is already returning the object ref
    };

    this.deleteTask = function(id) {
        if(this._tasks[id]){
            delete this._tasks[id];
        } else {
            console.error("Tried to add a duplicate task.");
        }
    };
}
