let formEl = document.querySelector("#task-form");
let taskToDoEl = document.querySelector("#tasks-to-do");

const taskFormHandler = function(event) {
    event.preventDefault();
    let taskNameInput=document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;

    // package up data as an object
    let taskDataObj= {
        name: taskNameInput,
        type:taskTypeInput
    };
    // cehck if input values are empty strings
    if(!taskNameInput || ! taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();
    // send it as an argument to createTaskEl 
    createTaskEl(taskDataObj);
};

const createTaskEl = function(taskDataObj){
    // create list item
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // create div to hold task info and add to list item
    let taskInfoEl = document.createElement("div");
    taskInfoEl.className="task-info";

    // add HTML content to div
    taskInfoEl.innerHTML="<h3 class='task-name'>" + taskDataObj.name +"</h3><span class='task-type'>"+ taskDataObj.type+"</span>";
    listItemEl.appendChild(taskInfoEl);
    
    // add entire list item to list
    taskToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit",taskFormHandler);