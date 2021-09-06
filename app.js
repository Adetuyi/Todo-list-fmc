//Gets the width of the devices and hides some content for mobile
if (window.innerWidth <= 425) {
  document.querySelector(".m-hidden").innerHTML = "";
}
//declare variables
const todo = document.querySelector(".todo");
const newTodo = document.querySelector("#create-todo");
const submit = document.querySelector(".submit");
const todoArea = document.querySelector(".todo-area");
const message = document.querySelector(".message");
const item = document.querySelector(".task-left");
const clearComp = document.querySelector(".clear-tasks");
const all = document.querySelector(".all");
const active = document.querySelector(".active");
const completeBtn = document.querySelector(".complete");
const mode = document.querySelector(".mode");

//Displays the list upon reloading
displayTodo();

//add event listener to target radio buttons
todo.addEventListener("click", function (e) {
  if (e.target.className == "radio") {
    //show checked icon and strikethrough text
    e.target.className += " check";
    e.target.parentElement.className += " completed";

    //complete the task
    completeTodo(e.target);
  }
});

//adds event listener to submit radio button
submit.addEventListener("click", function () {
  //checks if the todo input is empty
  if (newTodo.value == "") {
    //displays an error message
    showMessage("Cannot create an empty todo!");
  } else {
    //create new todo on submission
    createNewTodo(newTodo.value);

    //add new todo to list on the UI
    todoArea.innerHTML += `<div class="todo-item">
                              <div class="radio"></div>
                              <span>${newTodo.value}</span>                              
                          </div>`;
  }

  //reset input box to empty
  newTodo.value = "";
});

//Gets the todo from LS updates it and sends it back to LS
function createNewTodo(newTodo) {
  let todoList = getTodo();
  todoList.push(newTodo);
  setTodo(todoList);
}

//Shows error messages if any
function showMessage(msg) {
  message.textContent = msg;

  //Error message vanishes after set time
  setTimeout(function () {
    message.textContent = "";
  }, 3000);
}

//updates the number of uncompleted task left and updates the required field
function updateItemsLeft(num) {
  item.textContent = num;
}

//Local Storage Functions

//Gets list from LS

function getTodo(state = false) {
  //Gets the completed list or uncompleted list based on the state

  //Getting completed list
  if (state) {
    let todoList;
    if (localStorage.getItem("compList") === null) {
      todoList = [];
    } else {
      todoList = JSON.parse(localStorage.getItem("compList"));
    }
    return todoList;
  }

  //Getting Uncompleted list
  else {
    let todoList;
    if (localStorage.getItem("todoList") === null) {
      todoList = [];
    } else {
      todoList = JSON.parse(localStorage.getItem("todoList"));
    }

    //Update the items left every time getTodo is fired

    updateItemsLeft(todoList.length);

    return todoList;
  }
}

function setTodo(todoList, state = false) {
  //Sets the completed list or uncompleted list based on the state

  //Setting completed list
  if (state) {
    let list = JSON.stringify(todoList);
    localStorage.setItem("compList", list);
  }

  //Setting uncompleted list
  else {
    //Update the items left every time setTodo is fired
    updateItemsLeft(todoList.length);
    let list = JSON.stringify(todoList);
    localStorage.setItem("todoList", list);
  }
}

function displayTodo(state = false, filter = "off") {
  //Displays the completed list or uncompleted list based on the state

  if (!state) {
    let todoList = getTodo(true);
    if (todoList.length > 0) {
      todoList.forEach((todo) => {
        todoArea.innerHTML += `<div class="todo-item completed">
                              <div class="radio check"></div>
                              <span>${todo}</span>                              
                          </div>`;
      });
    }
    //Displays the uncompleted list after completed has displayed
    if (filter == "off") {
      displayTodo(true);
    }
  } else {
    let todoList = getTodo();
    if (todoList.length > 0) {
      todoList.forEach((todo) => {
        todoArea.innerHTML += `<div class="todo-item">
                              <div class="radio"></div>
                              <span>${todo}</span>                              
                          </div>`;
      });
    }
  }
}

//Moves list item to different LS upon completion
function completeTodo(target) {
  const completedTask = target.parentElement.lastElementChild.textContent;
  let todoList = getTodo();

  //Removes completed item from uncompleted list

  let completed = todoList.splice(todoList.indexOf(completedTask), 1);
  setTodo(todoList);
  let list = getTodo(true);
  list.push(completed[0]);
  setTodo(list, true);
}

//Clears all completed items
clearComp.addEventListener("click", function clearCompleted() {
  setTodo([], true);
  location.reload();
});

all.addEventListener("click", function () {
  todoArea.innerHTML = "";
  displayTodo();

  if (active.classList.contains("focus")) {
    active.classList.remove("focus");
  }
  if (completeBtn.classList.contains("focus")) {
    completeBtn.classList.remove("focus");
  }
  if (all.classList.contains("focus")) {
  } else {
    all.className += " focus";
  }
});

active.addEventListener("click", function () {
  todoArea.innerHTML = "";
  displayTodo(true);

  if (all.classList.contains("focus")) {
    all.classList.remove("focus");
  }
  if (completeBtn.classList.contains("focus")) {
    completeBtn.classList.remove("focus");
  }
  active.className += " focus";
});

completeBtn.addEventListener("click", function () {
  todoArea.innerHTML = "";
  displayTodo(false, true);

  if (all.classList.contains("focus")) {
    all.classList.remove("focus");
  }
  if (active.classList.contains("focus")) {
    active.classList.remove("focus");
  }
  completeBtn.className += " focus";
});
