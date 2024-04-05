// Side navbar function
function openNav() {
  document.getElementById("mySidenav").style.width = "260px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// Current Task Section

document.addEventListener('DOMContentLoaded', function () {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskInputDate = document.getElementById('task-input-date');
  const taskList = document.getElementById('task-list');
  let tasks = [];
  let completedTasks = [];

  // Function to save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }

  // Function to load tasks from localStorage
  function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      displayTasks();
    }
    const savedCompletedTasks = localStorage.getItem('completedTasks');
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
      date: taskDate
    };
    tasks.push(task);
    displayTasks();
    saveTasks();
  }

  // Function to display tasks
  function displayTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
    });
  }

  // Function to display completed tasks
  function displayCompletedTasks(completedTasks) {
    completedTasks.innerHTML = '';
    completedTasks.forEach(task => {
      const taskElement = createTaskElement(task);
      taskElement.classList.add('completed');
      completedTasks.appendChild(taskElement);
    });
  }
  // Function to create task element
  function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    if (task.completed) {
      taskElement.classList.add('completed');
    }
    taskElement.innerHTML = `
      <div class="task-info">
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span>${task.name}</span>
        <span class="task-date">${task.date}</span>
        <div class="task-actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;

    // Add event listener for checkbox to mark task as completed
    taskElement.querySelector('input[type="checkbox"]').addEventListener('change', () => {
      if (task.completed) {
        completedTasks = completedTasks.filter(t => t.id !== task.id);
      } else {
        completedTasks.push(task);
        tasks = tasks.filter(t => t.id !== task.id);
      }
      task.completed = !task.completed;
      displayTasks();
      saveTasks();
    });

    // Add event listener for editing task
    taskElement.querySelector('.edit-btn').addEventListener('click', () => {
      const newName = prompt('Enter new task name:', task.name);
      if (newName !== null) {
        task.name = newName;
        task.date = new Date().toLocaleString();
        displayTasks();
        saveTasks();
      }
    });

    // Add event listener for deleting task
    taskElement.querySelector('.delete-btn').addEventListener('click', () => {
      if (task.completed) {
        completedTasks = completedTasks.filter(t => t.id !== task.id);
      } else {
        tasks = tasks.filter(t => t.id !== task.id);
      }
      displayTasks();
      saveTasks();
    });

    return taskElement;
  }

  // Add event listener for form submission
  taskForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const taskName = taskInput.value.trim();
    const taskDate = taskInputDate.value;
    if (taskName !== '' && taskDate !== '') {
      addTask(taskName, taskDate);
      taskInput.value = '';
      taskInputDate.value = '';
    }
  });

  // Load tasks when the page is loaded
  loadTasks();
});
