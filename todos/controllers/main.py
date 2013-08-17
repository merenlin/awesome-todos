from todos import app
from todos.models.Todo import Todo
from flask import render_template, request, redirect, url_for
from flask.ext.wtf import Form, TextField, validators
import json

class CreateForm(Form):
    title = TextField('title', [validators.Length(min=1, max=20)])

@app.route('/', methods=['GET','POST'])
def main():
    form = CreateForm(request.form)
    todos = Todo()
    items = todos.getAll()
    return render_template('todos/index.html', form=form, items=items)

@app.route('/add', methods=['POST'])
def add_todo():
    if request.method == 'POST':
    	data = request.form
        from todos.models.Todo import Todo
        print data
        todo = Todo(1,data['title'])
        todo.add()
        return redirect(url_for('main'))
