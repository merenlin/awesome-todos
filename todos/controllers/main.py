from todos import app
from flask import render_template, request
from flask.ext.wtf import Form, TextField, validators


class CreateForm(Form):
    text = TextField(u'', [validators.Length(min=1, max=20)])

@app.route('/', methods=['GET', 'POST'])
def main():
    form = CreateForm(request.form)
    if request.method == 'POST' and form.validate():
        from todos.models.Todo import Todo
        todo = Todo(1,form.text.data)
        return render_template('todos/index.html')
    return render_template('todos/index.html', form=form)
