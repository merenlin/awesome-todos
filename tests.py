import unittest
from flask import Flask
from todos import app
from todos.models.Todo import Todo
from todos.database import db
import tempfile, os

class TestTodos(unittest.TestCase):
    def setUp(self):
        self.db_fd,app.config['DATABASE'] = tempfile.mkstemp()
        app.config['TESTING'] = True
        self.app = app.test_client()
        db.drop_all()
        db.create_all()

        " Populate the db with some todos "
        todo1 = Todo(1,'do stuff')
        todo2 = Todo(1,'do more stuff')
        todo3 = Todo(1,'do even more stuff')
        db.session.add(todo1)
        db.session.add(todo2)
        db.session.add(todo3)
        db.session.commit()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(app.config['DATABASE'])

    def test_main(self):
        response = self.app.get('/')
        assert 'do even more stuff' in response.data
        assert 'do stuff' in response.data
        assert 'do more stuff' in response.data

if __name__ == '__main__':
    unittest.main()

    