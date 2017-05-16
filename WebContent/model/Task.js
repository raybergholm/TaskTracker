function Task(id, title, description) {
    return {
        id: id || 0,
        title: title || "",
        description: description || "",
        status: "none", //TaskStatus.None, // might be a race condition here, depends on whether TaskStatus has been initialized at the time of instantiation
        comments: []
    };
}
