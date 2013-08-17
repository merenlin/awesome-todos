from sqlalchemy import Column, Integer, String
from todos.database import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(120), unique=True)

    def __init__(self, username=None, email=None):
        self.username = name
        self.email = email

    def __repr__(self):
        return '<User %r>' % (self.username)