const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const toolbarEl = document.querySelector('#toolbar');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const filterSelect = document.querySelector('#filter-select');
const searchInput = document.querySelector('#search-input');
const eraseBtn = document.querySelector('#erase-button');

let oldInputValue;

toolbarEl.style.display = 'flex';

const saveTodo = (text) => {
    const todo = document.createElement('div');
    todo.classList.add('todo');

    const todoTitle = document.createElement('h3');
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement('button');
    doneBtn.classList.add('finish-todo');
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-todo');
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('remove-todo');
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    todoList.appendChild(todo);

    todoInput.value = '';
    todoInput.focus();
}

const toggleForms = () => {
    todoForm.classList.toggle('hide');
    editForm.classList.toggle('hide');
    todoList.classList.toggle('hide');
    if (toolbarEl.style.display === 'flex') {
        toolbarEl.style.display = 'none';
    } else {
        toolbarEl.style.display = 'flex';
    }
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll('.todo');

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('h3');
        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
        }
    })
}

const filterTodos = (text) => {
    let todos = todoList.querySelectorAll('.todo');
    switch (text) {
        case 'all':
            todos.forEach((todo) => {
                todo.style.display = 'flex';
            })
            break;
        
        case 'done':
            todos.forEach((todo) => {
                todo.classList.contains('done') 
                ? (todo.style.display = 'flex') 
                : (todo.style.display = 'none');
            })
            break;
        
        case 'todo':
            todos.forEach((todo) => {
                todo.classList.contains('done')
                ? (todo.style.display = 'none')
                : (todo.style.display = 'flex');
            })

            break;
    }
}

const saveTodosToLocalStorage = () => {
    const todos = document.querySelectorAll('.todo');
    const todosArray = [];

    todos.forEach((todo) => {
        const todoText = todo.querySelector('h3').textContent;
        todosArray.push(todoText);
    })
    localStorage.setItem("todos", JSON.stringify(todosArray));
}

const loadTodosFromLocalStorage = () => {
    const todosArray = JSON.parse(localStorage.getItem("todos"));

    if (todosArray) {
        todoList.innerHTML = '';
        todosArray.forEach((todoText) => {
            saveTodo(todoText);
        })
    }
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue);
        saveTodosToLocalStorage();
    }
})

document.addEventListener('click', (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest('div');

    let todoTitle;

    if (parentEl && parentEl.querySelector('h3')) {
        todoTitle = parentEl.querySelector('h3').innerText;
    }

    if (targetEl.classList.contains('finish-todo')) {
        parentEl.classList.toggle('done');
    }

    if (targetEl.classList.contains('edit-todo')) {
        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }

    if (targetEl.classList.contains('remove-todo')) {
        parentEl.remove();
        saveTodosToLocalStorage();
    }
})

cancelEditBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleForms();
})

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const editInputValue = editInput.value;
    
    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
    saveTodosToLocalStorage();
})

filterSelect.addEventListener('change', (e) => {
    filterTodos(filterSelect.value);
})

searchInput.addEventListener('keyup', (e) => {
    let todos = document.querySelectorAll('.todo');

    let searchInputValue = searchInput.value; 

    for (let i = 0; i < todos.length; i++) {
        if (todos[i].querySelector('h3').innerHTML.toLowerCase().includes(searchInputValue.toLowerCase())) {
            todos[i].style.display = 'flex';
        } else {
            todos[i].style.display = 'none';
        }
    }
})

eraseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchInput.value = '';
})

loadTodosFromLocalStorage();