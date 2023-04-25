const newTask = document.querySelector(".new-task");
const addBtn = document.querySelector(".add-btn");
const taskList = document.querySelector(".task-list");
const sortBy = document.querySelector(".sort-by");
const showDoneSelect = document.querySelector(".show-done-select");
const totalCountElement = document.querySelector(".total-count");
const completedCountElement = document.querySelector(".completed-count");
const incompleteCountElement = document.querySelector(".incomplete-count");



let tasks = [];
let showDone = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
    const savedCheckboxStates = localStorage.getItem("checkboxStates");
    if (savedCheckboxStates) {
        const checkboxStates = JSON.parse(savedCheckboxStates);
        const checkboxes = document.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach((checkbox, index) => {
            checkbox.checked = checkboxStates[index];
        });
    }
}
function updateTaskCounts() {
  totalCountElement.innerText = tasks.length;
}

function updateCompletedTaskCount() {
  const completedTasks = tasks.filter(task => task.done);
  completedCountElement.innerText = completedTasks.length;
}

function updateIncompleteTaskCount() {
  const incompleteTasks = tasks.filter(task => !task.done);
  incompleteCountElement.innerText = incompleteTasks.length;
}


function renderTasks() {
    let sortedTasks;
    if (sortBy.value === "date-added") {
        sortedTasks = [...tasks].sort((a, b) => a.dateAdded - b.dateAdded);
tasks.sort((a, b) => a.dateAdded - b.dateAdded);
    } else if (sortBy.value === "text") {
        sortedTasks = [...tasks].sort((a, b) => a.text.localeCompare(b.text));
tasks.sort((a, b) => a.text.localeCompare(b.text));
    }

    taskList.innerHTML = "";
    sortedTasks.forEach((task, index) => {
        if (showDone === "all" || (showDone === "done" && task.done) || (showDone === "not-done" && !task.done)) {
            const li = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.done;
            checkbox.addEventListener("click", () => {
                tasks[index].done = checkbox.checked;
                saveTasks();
                renderTasks();
                saveCheckboxStates();
                if (checkbox.checked) {
                    label.style.textDecoration = "line-through";
                } else {
                    label.style.textDecoration = "";
                }
            });

            const timeSpan = document.createElement("span");
            const label = document.createElement("label");
            if (task.done) {
                label.style.textDecoration = "line-through";
            }
            label.innerText = task.text;

            timeSpan.innerText = " (Додано " + new Date(task.dateAdded).toLocaleString()+")";
            li.appendChild(checkbox);
            li.appendChild(label);
            li.appendChild(timeSpan);
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            
            deleteBtn.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        }
    });
  updateTaskCounts();
  updateCompletedTaskCount();
  updateIncompleteTaskCount();
    saveTasks();
    saveCheckboxStates();
}

function saveCheckboxStates() {
    const checkboxStates = {};
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach((checkbox, index) => {
        checkboxStates[index] = checkbox.checked;
    });
    localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));
}
function isTaskUnique(taskText) {
    for (const task of tasks) {
        if (task.text.toLowerCase() === taskText.toLowerCase()) {
            return false;
        }
    }
    return true;
}

addBtn.addEventListener("click", () => {
    const taskText = newTask.value.trim();
    
    if (!taskText) {
        alert("Введіть завдання, щоб додати його до списку!");
        return;
    }
    if (isTaskUnique(taskText)) {
        tasks.push({ text: taskText, done: false, dateAdded: Date.now() });
        newTask.value = "";
        renderTasks();
        
    } else {
        alert("Таке завдання вже існує. Введіть інше завдання.");
    }
});



sortBy.addEventListener("change", () => {
    renderTasks();
});

showDoneSelect.addEventListener("change", () => {
    showDone = showDoneSelect.value;
    renderTasks();
});



loadTasks();
