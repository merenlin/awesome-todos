from todos.database import db
import json

class Todo(db.Model):
    " Actual todo items "
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer)
    title = db.Column(db.String(120))
    done = db.Column(db.Boolean)

    def getAll(self):
        return self.query.all()

    def add(self):
        db.session.add(self)
        db.session.commit()

    def __init__(self, userId=None, title=None):
        self.userId = userId
        self.title = title
        self.done = False

    def __repr__(self):
        return '%r' % (self.__dict__)