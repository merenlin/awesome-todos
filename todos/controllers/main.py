from todos import app
from todos.models.Todo import Todo
from flask import render_template, request, jsonify
from flask.ext.wtf import Form, TextField, validators


@app.route('/', methods=['GET'])
def main():
    return render_template('todos/index.html')

@app.route('/api/', methods=['GET'])
def get_todos():
    todos = Todo()
    items = todos.getAll()     
    return jsonify(todos=items)

@app.route('/api/', methods=['POST'])
def add_todo():
    data = request.json
    todo = Todo(1,data['title'])
    todo_json = todo.add()
    return jsonify(todo=todo_json)


@app.route('/api/<todo_id>',  methods=['GET'])
def get_todo(todo_id):
    todos = Todo()
    todo = todos.get(todo_id)

    if todo is None:
        return jsonify(response=404)
    
    return jsonify(todo=data)

@app.route('/api/<todo_id>',  methods=['PUT'])
def update_todo(todo_id):
    data = request.json
    todos = Todo()
    print todo_id
    print data
    todos.update(todo_id,data)
    return jsonify(response='OK')