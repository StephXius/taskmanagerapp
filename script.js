// Side navbar function
function openNav() {
  document.getElementById("mySidenav").style.width = "260px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// Task Function
document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskInputDate = document.getElementById("task-input-date");
  const taskList = document.getElementById("task-list");
  const resetButton = document.getElementById("reset-button");
  let tasks = [];
  let completedTasks = [];

  // Function to save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }

  // Function to load tasks from localStorage
  function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      displayTasks();
    }
    const savedCompletedTasks = localStorage.getItem("completedTasks");
    if (savedCompletedTasks) {
      completedTasks = JSON.parse(savedCompletedTasks);
      displayCompletedTasks();
    }
  }

  // Function to add a new task
  function addTask(taskName, taskDate) {
    const task = {
      id: Date.now(),
      name: taskName,
      completed: false,
      date: taskDate,
    };
    tasks.push(task);
    displayTasks();
    saveTasks();
  }

  // Function to display tasks
  function displayTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
    });
  }

  // Function to display completed tasks
  function displayCompletedTasks() {
    // Select the completedTaskList element
    const completedTaskList = document.getElementById("completed-task-list");

    // Clear the existing completed tasks
    completedTaskList.innerHTML = "";

    // Display the completed tasks
    completedTasks.forEach(function (task) {
      const taskElement = createTaskElement(task);
      taskElement.classList.add("completed");
      completedTaskList.appendChild(taskElement);
    });
  }

  // Function to create task element
  function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    if (task.completed) {
      taskElement.classList.add("completed");
    }
    taskElement.innerHTML = `
      <div class="task-info">
      <label class="checkbox-container">
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span class="checkmark"></span>
      </label>
        <span>${task.name}</span>
        <span class="task-date">${task.date}</span>
        <div class="task-actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;

    // Event listener for checkbox to mark task as completed
    taskElement
      .querySelector('input[type="checkbox"]')
      .addEventListener("change", () => {
        task.completed = !task.completed;
        if (task.completed) {
          // Move the task from tasks to completedTasks
          tasks = tasks.filter((t) => t.id !== task.id);
          completedTasks.push(task);
        } else {
          // Move the task from completedTasks to tasks
          completedTasks = completedTasks.filter((t) => t.id !== task.id);
          tasks.push(task);
        }
        displayTasks();
        displayCompletedTasks();
        saveTasks();
      });

    // Event listener for editing task
    taskElement.querySelector(".edit-btn").addEventListener("click", () => {
      const newName = prompt("Enter new task name:", task.name);
      if (newName === null || newName.trim() === "") {
        alert("Please enter a task name.");
        return;
      }
      task.name = newName;
      let newDate = prompt("Enter new task date:", task.date);
      if (newDate !== null) {
        // To validate the date input using a regular expression
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        while (!dateRegex.test(newDate)) {
          alert("Invalid date format. Please use YYYY-MM-DD.");
          newDate = prompt("Enter new task date:", task.date);
        }
        task.date = newDate;
      }
      displayTasks();
      saveTasks();
    });

    // Event listener for deleting task
    taskElement.querySelector(".delete-btn").addEventListener("click", () => {
      if (task.completed) {
        completedTasks = completedTasks.filter((t) => t.id !== task.id);
      } else {
        tasks = tasks.filter((t) => t.id !== task.id);
      }
      displayTasks();
      displayCompletedTasks();
      saveTasks();
    });

    return taskElement;
  }

  // Event listener for form submission
  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskName = taskInput.value.trim();
    const taskDate = taskInputDate.value;
    if (taskName !== "" && taskDate !== "") {
      addTask(taskName, taskDate);
      taskInput.value = "";
      taskInputDate.value = "";
    } else {
      alert("Enter a valid task name and date");
    }
  });

  // Event listener for reset button
  resetButton.addEventListener("click", function () {
    if (localStorage.length === 0) {
      alert("There are no tasks to delete");
    } else {
      localStorage.clear();
      location.reload();
      alert("All tasks have been deleted");
    }
  });

  // Loads tasks when the page is loaded
  loadTasks();
});
