class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    generateUniqueId() {
        return Date.now();
    }

    addTask(title, description, priority) {
        if (!title.trim() || !priority.trim()) {
            alert("Title and priority are required.");
            return;
        }

        const duplicate = this.tasks.some(task => task.title === title);
        if (duplicate) {
            alert("Task with this title already exists.");
            return;
        }

        const newTask = {
            id: this.generateUniqueId(),
            title,
            description,
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(newTask);
        this.saveToLocalStorage();
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveToLocalStorage();
    }

    toggleTaskCompletion(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task) {
            console.error("Task not found.");
            return;
        }

        task.completed = !task.completed;
        this.saveToLocalStorage();
    }

    getTasks() {
        return this.tasks;
    }
}

// Initialize TaskManager
const taskManager = new TaskManager();
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';
    taskManager.getTasks().forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
        taskItem.innerHTML = `
            <div>
                <strong>${task.title}</strong> (${task.priority})
                <p>${task.description}</p>
            </div>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskItem.querySelector('.complete-btn').addEventListener('click', () => {
            taskManager.toggleTaskCompletion(task.id);
            renderTasks();
        });

        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
            taskManager.deleteTask(task.id);
            renderTasks();
        });

        taskList.appendChild(taskItem);
    });
}

// Handle form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;

    taskManager.addTask(title, description, priority);
    renderTasks();
    taskForm.reset();
});

// Initial render
renderTasks();
