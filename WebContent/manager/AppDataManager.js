sap.ui.define([
    "sap/ui/base/Object",
    "../model/Templater"
], function(BaseSapObject, Templater) {
    "use strict";

    // This class handles changes to the local JSON model
    return BaseSapObject.extend("com.tasky.manager.AppDataManager", {
        _oDataModel: null,
        _oTaskMetadataModel: null,
        _oLanguageModel: null,
        _oWorkareaModel: null, // stores temp copies
        _oTemplater: Templater,

        _mCurrentUser: null,
        getCurrentUser: function() {
            return this._mCurrentUser;
        },
        setCurrentUser: function(mUser) {
            if(!this._oDataModel) {
                this._handleNoModelException();
            }

            this._mCurrentUser = mUser;

            // also assign the current user to the work area
            this._oWorkareaModel.setProperty("/CurrentUser", mUser);
        },

        _initializeWorkingArea: function() { // stuff gets cloned here so that things can be changed without affecting the main model data.
            this._oWorkareaModel.setData({
                SelectedTask: null,
                SelectedTaskPath: "",
                CurrentUser: null
            });
        },

        _expandDataReferences: function() {
            if(!this._oDataModel) {
                this._handleNoModelException();
            }

            var i, j, timestamp, result;

            var tasks = this._oDataModel.getProperty("/Tasks");
            var users = this._oDataModel.getProperty("/Users");
            var comments = this._oDataModel.getProperty("/Comments");
            var todos = this._oDataModel.getProperty("/Todos");

            if(!tasks || !users || !comments || !todos) {
                throw new Error("DataManager's model is missing data!");
            }

            // making this a local function since it's not needed elsewhere. If we do, then we could just make it more abstract and put it somewhere more general
            var matchCollection = function(collection, id) {
                for(var i = 0; i < collection.length; i++) {
                    if(collection[i].id == id) { // TODO: making this a loose equality check for now since IDs might be int or string, but I want to make it all ints eventually
                        return collection[i];
                    }
                }
                return null;
            };

            for(i = 0; i < comments.length; i++) {
                result = matchCollection(users, comments[i].owner);
                if(result) {
                    comments[i].owner = result;
                }

                timestamp = new moment(comments[i].dateCreated);
                if(timestamp && timestamp.isValid()) {
                    comments[i].dateCreated = timestamp.toDate();
                }

                timestamp = new moment(comments[i].dateLastUpdated);
                if(timestamp && timestamp.isValid()) {
                    comments[i].dateLastUpdated = timestamp.toDate();
                }
            }

            for(i = 0; i < tasks.length; i++) {
                result = matchCollection(users, tasks[i].owner);
                if(result) {
                    tasks[i].owner = result;
                }

                timestamp = new moment(tasks[i].dateCreated);
                if(timestamp && timestamp.isValid()) {
                    tasks[i].dateCreated = timestamp.toDate();
                }

                timestamp = new moment(tasks[i].dateLastUpdated);
                if(timestamp && timestamp.isValid()) {
                    tasks[i].dateLastUpdated = timestamp.toDate();
                }

                for(j = 0; j < tasks[i].comments.length; j++) {
                    result = matchCollection(comments, tasks[i].comments[j]);
                    if(result) {
                        tasks[i].comments[j] = result;
                    }
                }

                for(j = 0; j < tasks[i].todos.length; j++) {
                    result = matchCollection(todos, tasks[i].todos[j]);
                    if(result) {
                        tasks[i].todos[j] = result;
                    }
                }
            }

            this._oDataModel.setProperty("/Tasks", tasks);
            this._oDataModel.setProperty("/Users", users);
            this._oDataModel.setProperty("/Comments", comments);
            this._oDataModel.setProperty("/Todos", todos);
        },

        _flattenDataReferences: function() {
            if(!this._oDataModel) {
                this._handleNoModelException();
            }

            var i, j, entry;

            var data = this._oDataModel.getData();
            var exportableData = {
                Tasks: [],
                Users: [],
                Comments: [],
                Todos: []
            };

            for(i = 0; i < data.Tasks.length; i++) {
                entry = jsUtils.Object.clone(data.Tasks[i]);

                entry.dateCreated = (new moment(entry.dateCreated)).format();
                entry.dateLastUpdated = (new moment(entry.dateLastUpdated)).format();
                entry.owner = entry.owner.id;

                entry.comments = [];
                for(j = 0; j < data.Tasks[i].comments.length; j++) {
                    entry.comments[j] = data.Tasks[i].comments[j].id;
                }

                entry.todos = [];
                for(j = 0; j < data.Tasks[i].todos.length; j++) {
                    entry.todos[j] = data.Tasks[i].todos[j].id;
                }

                exportableData.Tasks.push(entry);
            }

            for(i = 0; i < data.Users.length; i++) {
                entry = jsUtils.Object.clone(data.Users[i]);

                entry.lastOnline = (new moment(entry.lastOnline)).format();

                exportableData.Users.push(entry);
            }

            for(i = 0; i < data.Comments.length; i++) {
                entry = jsUtils.Object.clone(data.Comments[i]);

                entry.dateCreated = (new moment(entry.dateCreated)).format();
                entry.dateLastUpdated = (new moment(entry.dateLastUpdated)).format();
                entry.owner = entry.owner.id;

                exportableData.Comments.push(entry);
            }

            for(i = 0; i < data.Todos.length; i++) {
                entry = jsUtils.Object.clone(data.Todos[i]);

                exportableData.Todos.push(entry);
            }

            return exportableData;
        },

        _getNextId: function(haystack) {
            var maxId = 0;
            if(haystack) {
                for(var i = 0; i < haystack.length; i++) {
                    if(maxId < haystack[i].id) {
                        maxId = parseInt(haystack[i].id, 10);
                    }
                }
            }
            return ++maxId;
        },

        _dataLoadPostProcessing: function() {
            console.log(">>>>> _dataLoadPostProcessing() called");

            if(!this._oDataModel.getData()) {
                return;
            }
            this._initializeWorkingArea();
            this._expandDataReferences();

            var user = this._oDataModel.getProperty("/Users")[0];
            this.setCurrentUser(user);
        },

        _updateTaskStatusLabels: function(oEvent) {
            if(this._oTaskMetadataModel && this._oLocalisationModel) {
                var taskStatuses = this._oTaskMetadataModel.getProperty("/TaskStatuses");
                for(var i = 0; i < taskStatuses.length; i++) {
                    taskStatuses[i].value = this._oLocalisationModel.getProperty(taskStatuses[i].value);
                }
                this._oTaskMetadataModel.setProperty("/TaskStatuses", taskStatuses);
            }
        },

        _handleNoModelException: function() {
            throw new Error("DataManager has no model reference! Did you miss an .initialize() call?");
        },

        initialize: function(models) {
            if(models) {
                for(var prop in models) {
                    switch(prop) {
                        case "main":
                            this._oDataModel = models[prop];
                            this._oDataModel.attachEvent("requestCompleted", function(oEvent) {
                                this._dataLoadPostProcessing();
                            }.bind(this));
                            break;
                        case "taskMetadata":
                            this._oTaskMetadataModel = models[prop];
                            break;
                        case "languages":
                            this._oLanguageModel = models[prop];
                            break;
                        case "i18n":
                            this._oLocalisationModel = models[prop];
                            break;
                        case "workarea":
                            this._oWorkareaModel = models[prop];
                            break;
                    }
                }
            }

            if(this._oTaskMetadataModel) {
                this._oTaskMetadataModel.attachEvent("requestCompleted", this._updateTaskStatusLabels.bind(this));
            }

            console.log("DataManager init OK");
        },

        setData: function(data) {
            if(!this._oDataModel) {
                this._handleNoModelException();
            }

            this._oDataModel.setData(data);
            this._dataLoadPostProcessing(); // needs to be manually triggered when the data is explicitly set
        },

        initializeData: function() {
            this._initializeWorkingArea();

            this._oDataModel.setProperty("/Tasks", []);
            this._oDataModel.setProperty("/Comments", []);
            this._oDataModel.setProperty("/Todos", []);

            // Special case: we always need at least one entry in /Users so create a default profile to replace the existing one
            var defaultUser = this._oTemplater.User();
            defaultUser.id = 0;
            this._oDataModel.setProperty("/Users", [defaultUser]);
            this.setCurrentUser(defaultUser);

            return true;
        },

        setMockData: function() {
            if(!this._oDataModel) {
                this._handleNoModelException();
            }

            this._oDataModel.loadData(jQuery.sap.getModulePath("com.tasky.model", "/mockData.json"));
        },

        changeSelectedTask: function(sPath) {
            if(!this._oDataModel) {
                this._handleNoModelException();
            }

            var workingCopy = jsUtils.Object.clone(this._oDataModel.getProperty(sPath));

            this._oWorkareaModel.setProperty("/SelectedTask", workingCopy);
            this._oWorkareaModel.setProperty("/SelectedTaskPath", sPath);
        },

        updateSelectedTask: function() {
            var selectedTask = this._oWorkareaModel.getProperty("/SelectedTask");
            var selectedTaskPath = this._oWorkareaModel.getProperty("/SelectedTaskPath");
            selectedTask.dateLastUpdated = new Date();

            this._oDataModel.setProperty(selectedTaskPath, selectedTask);

            this.changeSelectedTask(selectedTaskPath);
        },

        clearSelectedTask: function() {
            this._oWorkareaModel.setProperty("/SelectedTask", null);
            this._oWorkareaModel.setProperty("/SelectedTaskPath", "");
        },

        createTask: function() {
            if(!this._oDataModel) {
                this._handleNoModelException();
            }

            var newTask = this._oTemplater.Task();

            newTask.id = this.getNextTaskId();
            newTask.title = "New Task";
            newTask.dateCreated = new Date();
            newTask.dateLastUpdated = new Date();
            newTask.owner = this._oWorkareaModel.getProperty("/CurrentUser");

            var tasks = this._oDataModel.getProperty("/Tasks");
            tasks.push(newTask);
            this._oDataModel.setProperty("/Tasks", tasks);
        },

        deleteTask: function(bindingPath) {
            if(!this._oDataModel) {
                this._handleNoModelException();
            }

            var index = bindingPath.split("/");
            index = index[index.length - 1];

            var tasks = this._oDataModel.getProperty("/Tasks");
            tasks.splice(index, 1);
            this._oDataModel.setProperty("/Tasks", tasks);
        },

        addComment: function(text) {
            if(!this._oDataModel) {
                this._handleNoModelException();
            }

            var comments = this._oDataModel.getProperty("/Comments");

            var newComment = this._oTemplater.Comment();
            newComment.id = this.getNextCommentId();
            newComment.dateCreated = new Date();
            newComment.dateLastUpdated = new Date();
            newComment.owner = this._oWorkareaModel.getProperty("/CurrentUser");
            newComment.text = text;

            comments.push(newComment);
            this._oDataModel.setProperty("/Comments", comments);

            var selectedTask = this._oWorkareaModel.getProperty("/SelectedTask");
            selectedTask.comments.push(newComment);
            this._oWorkareaModel.setProperty("/SelectedTask", selectedTask);
        },

        addTodo: function(text) {
            if(!this._oDataModel) {
                this._handleNoModelException();
            }

            var todos = this._oDataModel.getProperty("/Todos");

            var newTodo = this._oTemplater.Todo();
            newTodo.id = this.getNextTodoId();
            newTodo.text = text;

            todos.push(newTodo);
            this._oDataModel.setProperty("/Todos", todos);

            var selectedTask = this._oWorkareaModel.getProperty("/SelectedTask");
            selectedTask.todos.push(newTodo);
            this._oWorkareaModel.setProperty("/SelectedTask", selectedTask);
        },

        updateUserSettings: function(){
            this._oDataModel.setProperty("/Users/0", this._mCurrentUser); // NOTE: If this ever gets upgraded to support multiple users, this part clearly needs changing

            var clonedUser = jsUtils.Object.clone(this._mCurrentUser);
            this.setCurrentUser(clonedUser); // disconnect the references again
        },

        getNextTaskId: function() {
            return this._getNextId(this._oDataModel.getProperty("/Tasks"));
        },

        getNextCommentId: function() {
            return this._getNextId(this._oDataModel.getProperty("/Comments"));
        },

        getNextTodoId: function() {
            return this._getNextId(this._oDataModel.getProperty("/Todos"));
        },

        setCategoryGroupings: function(key){
            var tasks = this._oDataModel.getProperty("/Tasks");
            var categories = [];

            var comparatorFunction = function(needle, haystack){
                for(var i = 0; i < haystack.length; i++){
                    if(haystack[i].hasOwnProperty(key) && needle.hasOwnProperty(key) && haystack[i][key] === needle[key]){
                        return true;
                    }
                }
                return false;
            };

            for(var task in tasks){
                // TODO: hmm need to iterate over this and get a unique count
            }

            if(!jsUtils.Array.matchOne(categories, tasks, comparatorFunction)){

            }



            this._oTemplater.Category();
            this._oTemplater.CategoryItem();

            this._oWorkareaModel.setProperty("/Categories", categories);

            console.log(tasks);
            console.log(key);
        },

        // Returns a copy of the data currently found in the model in JSON format. Cross-entity links are flattened to IDs, and temp vars are stripped from this copy.
        createExportableData: function() {
            // TODO: Currently this doesn't modify any of the data. But it would make sense to prune old comments and todos which are no longer referenced, reassign IDs, etc
            return this._flattenDataReferences();
        },
    });
});
