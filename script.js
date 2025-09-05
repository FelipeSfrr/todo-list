const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = "";
  saveTasks();
  renderTasks();
});


function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = task.text;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(removeBtn);
    taskList.appendChild(li);
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});


renderTasks();
