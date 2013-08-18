from flask.ext.sqlalchemy import SQLAlchemy
from todos import app

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/production.db'
db = SQLAlchemy(app)