sap.ui.define([
    "sap/ui/base/Object"
], function(BaseSapObject) {
	"use strict";

    var objInstance = BaseSapObject.extend("com.tasky.manager.IdManager", {
        _dataModel: null,
        _nextIds: {
            task: 0,
            comment: 0,
            todo: 0
        },

        linkDataModel: function(model){
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
            var i, temp;
            for(i = 0; i < this._dataModel.Tasks.length; i++){
                if(this._nextIds.task < this._dataModel.Tasks[i].id){
                    this._nextIds.task = parseInt(this._dataModel.Tasks[i].id, 10);
                }
            }
            this._nextIds.task++;

            for(i = 0; i < this._dataModel.Comments.length; i++){
                if(this._nextIds.comment < this._dataModel.Comments[i].id){
                    this._nextIds.comment = parseInt(this._dataModel.Comments[i].id, 10);
                }
            }
            this._nextIds.comment++;

            for(i = 0; i < this._dataModel.Todos.length; i++){
                if(this._nextIds.todo < this._dataModel.Todos[i].id){
                    this._nextIds.todo = parseInt(this._dataModel.Todos[i].id, 10);
                }
            }
            this._nextIds.todo++;
        }

    });

    return objInstance;
});
