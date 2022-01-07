var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");

var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskFormHandler = function (event) {
  //prevents browser from refreshing each time a user submits form
  event.preventDefault();

  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  //check if input values are empty stings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
    //check if the number of characters are at least 3
  } else if (taskNameInput.length <= 2) {
    alert("Please enter at least 3 characters.");
    return false;
  }
  //resets form after submission
  formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");

  //has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  //no data attribute, so create object as normal and pass to createTaskEl function
  else {
    //package up data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
    };
    //send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function (taskDataObj) {
  //create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  //add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  //make list draggable
  listItemEl.setAttribute("draggable", "true");

  //create div to hold task info
  var taskInfoEl = document.createElement("div");
  //give it a class name
  taskInfoEl.className = "task-info";
  //add HTML content to div
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";

  //add task <div> to list<li>
  listItemEl.appendChild(taskInfoEl);

  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  //add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

  //increase task counter for next unique id
  taskIdCounter++;
};

var createTaskActions = function (taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  //create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  //create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  //select element
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(statusSelectEl);

  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i = 0; i < statusChoices.length; i++) {
    //create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    //append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
};

var taskButtonHandler = function (event) {
  //delete button was clicked
  if (event.target.matches(".delete-btn")) {
    //get the element's task id
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
  //edit button was clicked
  else if (event.target.matches(".edit-btn")) {
    //get the element's task id
    var taskId = event.target.getAttribute("data-task-id");
    editTask(taskId);
  }
};

//delete task logic
var deleteTask = function (taskId) {
  //find the matching task list item
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();
};

//edit task logic
var editTask = function (taskId) {
  //find the matching task list item
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  //get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";

  formEl.setAttribute("data-task-id", taskId);
};

//edit task progress
var taskStatusChangeHandler = function (event) {
  //get the element's task id
  var taskId = event.target.getAttribute("data-task-id");

  //get the current selected options value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  //find the parent task item element based on the id
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
};

var completeEditTask = function (taskName, taskType, taskId) {
  //find the matching task list item
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  //set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  alert("Task Updated!");

  //reset form by removing task id attribute and changing text back to "Add Task"
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

//drag and drop functions
var dragTaskHandler = function (event) {
  var taskId = event.target.getAttribute("data-task-id");
  event.dataTransfer.setData("text/plain", taskId);
};

var dropZoneHandler = function (event) {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) {
    event.preventDefault();
  }
};

var dropTaskHandler = function (event) {
  var id = event.dataTransfer.getData("text/plain");
  //task item
  var draggableElement = document.querySelector("[data-task-id='" + id + "']");
  var dropZoneEl = event.target.closest(".task-list");
  var statusType = dropZoneEl.id;

  //set status of task based on dropZone id
  var statusSelectEl = draggableElement.querySelector(
    "select[name='status-change']"
  );

  if (statusType === "tasks-to-do") {
    statusSelectEl.selectedIndex = 0;
  } else if (statusType === "tasks-in-progress") {
    statusSelectEl.selectedIndex = 1;
  } else if (statusType === "tasks-completed") {
    statusSelectEl.selectedIndex = 2;
  }

  dropZoneEl.appendChild(draggableElement);
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);

//drag and drop eventListeners
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
