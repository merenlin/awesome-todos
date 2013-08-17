from flask.ext.sqlalchemy import SQLAlchemy
from todos import app

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)

def init_db():
    db.create_all()