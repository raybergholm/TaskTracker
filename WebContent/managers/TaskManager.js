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
