sap.ui.define([
    "sap/ui/base/Object"
], function(BaseSapObject) {
	"use strict";

    var objInstance = BaseSapObject.extend("com.tasky.model.Templater", {});

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
