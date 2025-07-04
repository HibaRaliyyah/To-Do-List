// Select elements.
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage
window.onload = loadTasks;

// Add task
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('You must write something!');
        return;
    }
    createTaskElement(text);
    taskInput.value = '';
    saveTasks();
}

// Now also accepts "important" flag
function createTaskElement(text, completed = false, important = false) {
    const li = document.createElement('li');
    if (completed) li.classList.add('completed');
    if (important) li.classList.add('important');

    const span = document.createElement('span');
    span.textContent = text;
    span.onclick = () => {
        li.classList.toggle('completed');
        saveTasks();
    };

    // Important button
    const impBtn = document.createElement('button');
    impBtn.textContent = important ? '★' : '☆'; // Filled star if important
    impBtn.className = 'important-btn';
    impBtn.title = 'Mark as Important';
    impBtn.onclick = () => {
        li.classList.toggle('important');
        impBtn.textContent = li.classList.contains('important') ? '★' : '☆';
        saveTasks();
    };

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.onclick = () => {
        if (editBtn.textContent === 'Edit') {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            li.replaceChild(input, span);
            editBtn.textContent = 'Save';
            input.focus();

            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') editBtn.click();
            });
        } else {
            const input = li.querySelector('input');
            const newText = input.value.trim();
            if (newText === '') {
                alert('Task cannot be empty!');
                return;
            }
            span.textContent = newText;
            li.replaceChild(span, input);
            editBtn.textContent = 'Edit';
            saveTasks();
        }
    };

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
    delBtn.onclick = () => {
        li.remove();
        saveTasks();
    };

    li.appendChild(span);
    li.appendChild(impBtn);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    taskList.appendChild(li);
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(li => {
        tasks.push({
            text: li.querySelector('span') ? li.querySelector('span').textContent : '',
            completed: li.classList.contains('completed'),
            important: li.classList.contains('important')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(task => createTaskElement(task.text, task.completed, task.important));
}