sap.ui.define([], function() {
	"use strict";

    return {
        Task: function(){
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
        },

        Comment: function(){
            return {
                id: null,
                dateCreated: new Date(),
                dateLastUpdated: new Date(),
                owner: "",
                text: ""
            };
        },

        Todo: function(){
            return {
                text: "",
                isDone: false,
                valueState: "None"
            };
        }
    }
});
