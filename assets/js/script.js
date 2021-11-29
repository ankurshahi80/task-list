let formEl = document.querySelector("#task-form");
let taskToDoEl = document.querySelector("#tasks-to-do");

let createTaskHandler = function(event) {
    event.preventDefault();
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent="This is a new task.";
    taskToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit",createTaskHandler);