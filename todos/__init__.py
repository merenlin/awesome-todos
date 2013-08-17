__version__ = '0.0'
from flask import Flask
from flask_debugtoolbar import DebugToolbarExtension
app = Flask('todos')
app.config['SECRET_KEY'] = 'random'
app.debug = True
toolbar = DebugToolbarExtension(app)
from todos.controllers import *
from todos.models import *
from todos.database import db
db.drop_all()
db.create_all()