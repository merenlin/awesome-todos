from todos import app
from todos.models.Todo import Todo
from flask import render_template, request, redirect, url_for,jsonify
from flask.ext.wtf import Form, TextField, validators
import json

@app.route('/', methods=['GET'])
def main():
    return render_template('todos/index.html')

@app.route('/api', methods=['GET'])
def get_todos():
    todos = Todo()
    items = todos.getAll()
    data = []

    for item in items:
    	todo = {}
        todo['title'] = item.title
        todo['done'] = item.done
        data.append(todo)
    
    return jsonify(todos=data)

@app.route('/api', methods=['POST'])
def add_todo():
    data = request.json
    todo = Todo(1,data['title'])
    todo.add()
    return jsonify(result='OK')
