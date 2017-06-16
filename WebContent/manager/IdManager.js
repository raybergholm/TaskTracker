sap.ui.define([
    "sap/ui/base/Object"
], function(BaseSapObject) {
	"use strict";

    return BaseSapObject.extend("com.tasky.manager.IdManager", {
        _dataModel: null,
        _nextIds: {
            task: 0,
            comment: 0,
            todo: 0
        },

        initialize: function(model){
            this._dataModel = model;
            this._recalculateNextIds();
        },

        getNextTaskId: function(){
            this._recalculateNextIds();
            return this._nextIds.task;
        },

        getNextCommentId: function(){
            this._recalculateNextIds();
            return this._nextIds.comment;
        },

        getNextTodoId: function(){
            this._recalculateNextIds();
            return this._nextIds.todo;
        },

        _recalculateNextIds: function(){
            // just get the next number after the highest ID value. We don't need to worry about gaps in the numbering
            var i, haystack;

            haystack = this._dataModel.getProperty("/Tasks");
            if(haystack){
                for(i = 0; i < haystack.length; i++){
                    if(this._nextIds.task < haystack[i].id){
                        this._nextIds.task = parseInt(haystack[i].id, 10);
                    }
                }
                this._nextIds.task++;
            }

            haystack = this._dataModel.getProperty("/Comments");
            if(haystack){
                for(i = 0; i < haystack.length; i++){
                    if(this._nextIds.comment < haystack[i].id){
                        this._nextIds.comment = parseInt(haystack[i].id, 10);
                    }
                }
                this._nextIds.comment++;
            }

            haystack = this._dataModel.getProperty("/Todos");
            if(haystack){
                for(i = 0; i < haystack.length; i++){
                    if(this._nextIds.todo < haystack[i].id){
                        this._nextIds.todo = parseInt(haystack[i].id, 10);
                    }
                }
                this._nextIds.todo++;
            }
        }
    });
});
