""" API controller for the 'Awesome Todos' web app. """

from todos import app
from todos.models.Todo import Todo
from flask import render_template, request, jsonify

@app.route('/', methods=['GET'])
def main():
    """ Index page loader. """
    return render_template('todos/index.html')

@app.route('/api/', methods=['GET'])
def get_todos():
    """ Fetching the current state of the db. """
    todos = Todo()
    items = todos.getAll()     
    return jsonify(todos=items)

@app.route('/api/', methods=['POST'])
def add_todo():
    """ Adding a new todo item with default user set. """
    data = request.json
    todo = Todo(title=data['title'])
    todo_json = todo.add()
    return jsonify(todo=todo_json)

@app.route('/api/<todo_id>', methods=['GET'])
def get_todo(todo_id):
    """ Get a todo by id call. """
    todos = Todo()
    todo = todos.get(todo_id)
    if todo is None:
        return jsonify(response=404)
    return jsonify(todo=todo)

@app.route('/api/<todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """ Update a todo by id call. New fields are in the request. """
    data = request.json
    todos = Todo()
    todos.update(todo_id, data)
    return jsonify(response='OK')

@app.route('/api/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """ Delete a todo by id call. """
    todos = Todo()
    todos.delete(todo_id)
    return jsonify(response='OK')