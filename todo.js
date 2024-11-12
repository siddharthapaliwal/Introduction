const fs = require('fs');
const yargs = require('yargs');

// Set up yargs command
yargs.command({
  command: 'add',
  describe: 'Add a new todo',
  builder: {
    title: {
      describe: 'Todo title',
      demandOption: true,
      type: 'string'
    },
    description: {
      describe: 'Todo description',
      type: 'string',
      default: ''
    }
  },
  handler(argv) {
    addTodo(argv.title, argv.description);
  }
});

yargs.command({
  command: 'list',
  describe: 'List all todos',
  handler() {
    listTodos();
  }
});

yargs.command({
  command: 'remove',
  describe: 'Remove a todo by title',
  builder: {
    title: {
      describe: 'Todo title',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    removeTodo(argv.title);
  }
});

yargs.command({
  command: 'update',
  describe: 'Update a todo description by title',
  builder: {
    title: {
      describe: 'Todo title',
      demandOption: true,
      type: 'string'
    },
    description: {
      describe: 'New description',
      type: 'string',
      demandOption: true
    }
  },
  handler(argv) {
    updateTodo(argv.title, argv.description);
  }
});

// Function to add a new todo
const addTodo = (title, description) => {
  const todos = loadTodos();
  const duplicate = todos.find(todo => todo.title === title);

  if (duplicate) {
    console.log('Todo with this title already exists');
    return;
  }

  todos.push({
    title,
    description
  });

  saveTodos(todos);
  console.log(`Todo added: ${title}`);
};

// Function to list all todos
const listTodos = () => {
  const todos = loadTodos();
  console.log('Your Todos:');
  todos.forEach(todo => {
    console.log(`Title: ${todo.title}\nDescription: ${todo.description}\n`);
  });
};

// Function to remove a todo
const removeTodo = (title) => {
  let todos = loadTodos();
  const newTodos = todos.filter(todo => todo.title !== title);

  if (todos.length === newTodos.length) {
    console.log('Todo not found');
    return;
  }

  saveTodos(newTodos);
  console.log(`Todo removed: ${title}`);
};

// Function to update a todo's description
const updateTodo = (title, description) => {
  let todos = loadTodos();
  const todoIndex = todos.findIndex(todo => todo.title === title);

  if (todoIndex === -1) {
    console.log('Todo not found');
    return;
  }

  todos[todoIndex].description = description;
  saveTodos(todos);
  console.log(`Todo updated: ${title}`);
};

// Load todos from file
const loadTodos = () => {
  try {
    const dataBuffer = fs.readFileSync('todos.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

// Save todos to file
const saveTodos = (todos) => {
  const dataJSON = JSON.stringify(todos, null, 2);
  fs.writeFileSync('todos.json', dataJSON);
};

// Parse arguments and run the app
yargs.parse();
//notes
// mkdir todo-app
// cd todo-app
// npm init -y
//npm install yargs
//touch todo.js
//node todo.js add --title "Buy groceries" --description "Milk, Eggs, Bread"
//node todo.js list
//node todo.js remove --title "Buy groceries"
//node todo.js update --title "Buy groceries" --description "Milk, Eggs, Bread, Butter"
