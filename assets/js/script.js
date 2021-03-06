let taskIdCounter = 0;

let formEl = document.querySelector("#task-form");
let taskToDoEl = document.querySelector("#tasks-to-do");
let tasksInProgressEl=document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");
let pageContentEl = document.querySelector("#page-content");

// create array to hold tasks for saving
let tasks=[];

const taskFormHandler = function(event) {
    event.preventDefault();
    let taskNameInput=document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    // check if input values are empty strings
    if(!taskNameInput || ! taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value="";
    document.querySelector("select[name='task-type']").selectecIndex=0;

    // check if task is new or one being edited by seeing if it has a data-task-id attribute
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
            type:taskTypeInput,
            status:"to do"
        };
    

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

    // loop through tasks array and task object with new content
    for (let i=0; i<tasks.length; i++) {
        if(tasks[i].id === parseInt(taskId)){
            tasks[i].name=taskName;
            tasks[i].type=taskType;
        }
    };

    // add tasks to local storage
    saveTasks();

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

    switch (taskDataObj.status) {
        case "to do":
            taskActionEl.querySelector("select[name='status-change']").selectecIndex=0;
            taskToDoEl.append(listItemEl);
            break;
        case "in progress":
            taskActionEl.querySelector("select[name='status-change']").selectecIndex=1;
            tasksInProgressEl.append(listItemEl);
            break;
        case "completed":
            taskActionEl.querySelector("select[name='status-change']").selectecIndex=3;
            tasksCompletedEl.append(listItemEl);
            break;
        default:
            console.log("something went wrong!");
    }
    
    // save task as an object with name, type, status, and id properties then push it into tasks array 
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // save tasks to local Storage
    saveTasks();

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

    // create new array to hold updated list of tasks
    let updatedTaskArr=[];

    // loop through the current tasks
    for(let i=0; i<tasks.length; i++){
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if(tasks[i].id!==parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks=updatedTaskArr;
    
    // save tasks to local Storage
    saveTasks();
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

    // update task's in tasks array
    for(let i=0; i<tasks.length; i++){
        if(tasks[i].id===parseInt(taskId)){
            tasks[i].status=statusValue;
        }
    }
    
    // save tasks to the local storage
    saveTasks();
};

const saveTasks = function() {
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

const loadTasks = function() {
    // get task items from localStorage
    let savedTasks = localStorage.getItem("tasks");
    
    // convert tasks from the string from back into an array of objects
    if(!savedTasks){
        return false;
    };
    
    savedTasks=JSON.parse(savedTasks);
    console.log(savedTasks);
    
    // iterate through a tasks array and create task elements on the page from it
    for (let i=0; i<savedTasks.length;i++){
        // pass each task object into the createTaskEl() function
        createTaskEl(savedTasks[i]);
    }
}

pageContentEl.addEventListener("click",taskButtonHandler);
pageContentEl.addEventListener("change",taskStatusChangeHandler);
loadTasks();