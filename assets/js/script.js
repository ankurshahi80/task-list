let formEl = document.querySelector("#task-form");
let taskToDoEl = document.querySelector("#tasks-to-do");
let tasksInProgressEl=document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");
let taskIdCounter = 0;
let pageContentEl = document.querySelector("#page-content");

const taskFormHandler = function(event) {
    event.preventDefault();
    let taskNameInput=document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;

    let isEdit = formEl.hasAttribute("data-task-id");
    
    if(isEdit) {
        let taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
        // package up data as an object
        let taskDataObj= {
            name: taskNameInput,
            type:taskTypeInput
        };
        // check if input values are empty strings
    if(!taskNameInput || ! taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();
    // send it as an argument to createTaskEl 
    createTaskEl(taskDataObj);
    }
};

const completeEditTask=function(taskName, taskType, taskId){
    // find the matching task list item
    let taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent= taskType;

    alert("Task updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent="Add Task";
};

const createTaskEl = function(taskDataObj){
    // create list item
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id",taskIdCounter);

    // create div to hold task info and add to list item
    let taskInfoEl = document.createElement("div");
    taskInfoEl.className="task-info";

    // add HTML content to div
    taskInfoEl.innerHTML="<h3 class='task-name'>" + taskDataObj.name +"</h3><span class='task-type'>"+ taskDataObj.type+"</span>";
    listItemEl.appendChild(taskInfoEl);
    
    let taskActionEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionEl);

    // add entire list item to list
    taskToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;
};

const createTaskActions = function(taskId){
    let actionContainerEl = document.createElement("div");
    actionContainerEl.className="task-actions";

    // create edit button
    let editButtonEl = document.createElement("button");
    editButtonEl.textContent="Edit";
    editButtonEl.className="btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    let deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent="Delete";
    deleteButtonEl.className="btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id",taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    let statusSelectEl = document.createElement("select");
    statusSelectEl.className="select-status";
    statusSelectEl.setAttribute("name","status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    let statusChoices=["To Do", "In Progress", "Completed"];
    for(var i=0; i<statusChoices.length;i++){
        // create option element
        let statusOptionEl = document.createElement("option");
        statusOptionEl.textContent=statusChoices[i];
        statusOptionEl.setAttribute("value",statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
};

formEl.addEventListener("submit",taskFormHandler);

const taskButtonHandler = function(event) {
    // get target element from event
    let targetEl = event.target;

    // edit button was clicked
    if(targetEl.matches(".edit-btn")){
        let taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } 

    // delete button was clicked
    if(targetEl.matches(".delete-btn")){
        let taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

const editTask = function(taskId){
    console.log("editing task #" + taskId);

    // get task list item element
    let taskSelected=document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    let taskName = taskSelected.querySelector("h3.task-name").textContent;
    document.querySelector("input[name='task-name']").value = taskName;

    let taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector("#save-task").textContent="Save Task";
    formEl.setAttribute("data-task-id", taskId);
};

const deleteTask = function(taskId){
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

let taskStatusChangeHandler = function(event) {
    // get the task item's id
    let taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    let statusValue = event.target.value.toLowerCase();
    
    // find the parent task item element based on the id
    let taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");

    if(statusValue ==="to do") {
        taskToDoEl.appendChild(taskSelected);
    }
    else if(statusValue==="in progress"){
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if(statusValue ==="completed"){
        tasksCompletedEl.appendChild(taskSelected);
    }
};
pageContentEl.addEventListener("click",taskButtonHandler);
pageContentEl.addEventListener("change",taskStatusChangeHandler);