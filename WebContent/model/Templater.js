sap.ui.define([], function() {
    "use strict";

    return {
        Task: function(params) {
            return {
                id: params && params.hasOwnProperty("id") ? params.id : null,
                status: params && params.hasOwnProperty("status") ? params.status : "none",
                icon: params && params.hasOwnProperty("icon") ? params.icon : "",
                title: params && params.hasOwnProperty("title") ? params.title : "",
                priority: params && params.hasOwnProperty("priority") ? params.priority : "normal",
                description: params && params.hasOwnProperty("description") ? params.description : "",
                dateCreated: new Date(),
                dateLastUpdated: new Date(),
                owner: params && params.hasOwnProperty("owner") ? params.owner : "",
                comments: params && params.hasOwnProperty("comments") ? params.comments : [],
                todos: params && params.hasOwnProperty("todos") ? params.todos : []
            };
        },

        Comment: function(params) {
            return {
                id: params && params.hasOwnProperty("id") ? params.id : null,
                dateCreated: new Date(),
                dateLastUpdated: new Date(),
                owner: params && params.hasOwnProperty("owner") ? params.id : "",
                text: params && params.hasOwnProperty("text") ? params.id : ""
            };
        },

        Todo: function(params) {
            return {
                text: params && params.hasOwnProperty("text") ? params.text : "",
                isDone: params && params.hasOwnProperty("isDone") ? params.isDone : false,
                valueState: params && params.hasOwnProperty("valueState") ? params.valueState : "None"
            };
        },

        User: function(params) {
            return {
    	        id: params && params.hasOwnProperty("id") ? params.id : null,
    	        icon: params && params.hasOwnProperty("icon") ? params.icon : "sap-icon://person-placeholder",
    	        username: params && params.hasOwnProperty("username") ? params.username : "",
                language: params && params.hasOwnProperty("language") ? params.language : "en",
                verboseErrorMode: params && params.hasOwnProperty("verboseErrorMode") ? params.verboseErrorMode : true,
    	        lastOnline: new Date()
            };
        },

        Category: function(params) {
            return {
                name: params && params.hasOwnProperty("name") ? params.name : "",
                items: params && params.hasOwnProperty("items") ? params.items : []
            };
        },

        CategoryItem: function(params) {
            return {
                task: params && params.hasOwnProperty("task") ? params.task : null,
                originalPath: params && params.hasOwnProperty("originalPath") ? params.originalPath : ""
            }
        }
    }
});
