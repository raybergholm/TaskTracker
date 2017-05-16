function Task(title, description) {
    var taskId;
    if(TaskManager){
        taskId = TaskManager.getNextTaskId();
    }else {
        taskId = 0;
    }

    return {
        id: taskId,
        title: title || "",
        description: description || "",
        status: "none", //TaskStatus.None, // might be a race condition here, depends on whether TaskStatus has been initialized at the time of instantiation
        comments: []
    };
}
