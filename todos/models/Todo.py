from todos.database import db
import json

class Todo(db.Model):
    " Actual todo items "
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer)
    title = db.Column(db.String(120))
    done = db.Column(db.Boolean)
    order = db.Column(db.Integer)

    def get(self, todo_id):
        todo = self.query.get(todo_id)
        return todo.toJSON()

    def getAll(self):
        data = []
        items = self.query.all()
        for item in items:
            data.append(item.toJSON())
        return data

    def add(self):
        db.session.add(self)
        db.session.commit()
        return self.toJSON()

    def update(self, todo_id, new_fields):
        todo = self.get(todo_id)
        self.query.filter_by(id=todo_id).update(new_fields)
        db.session.commit()

    def toJSON(self):
        todo_json = {}
        todo_json['id'] = self.id
        todo_json['title'] = self.title
        todo_json['done'] = self.done
        todo_json['order'] = self.done
        return todo_json

    def __init__(self, userId=None, title=None):
        self.userId = userId
        self.title = title
        self.done = False

    def __repr__(self):
        return '%r' % (self.__dict__)