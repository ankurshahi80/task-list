let formEl = document.querySelector("#task-form");
let taskToDoEl = document.querySelector("#tasks-to-do");
let taskIdCounter = 0;
let pageContentEl = document.querySelector("#page-content");

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

    if(event.target.matches(".delete-btn")){
        let taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

const deleteTask = function(taskId){
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

pageContentEl.addEventListener("click",taskButtonHandler);