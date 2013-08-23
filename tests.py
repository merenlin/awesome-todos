# -*- coding: utf-8 -*-
import unittest
from flask import Flask
from todos import app
from todos.models.Todo import Todo
from todos.database import db
import tempfile, os
import json

class TestTodos(unittest.TestCase):
    def setUp(self):
        self.db_fd,app.config['DATABASE'] = tempfile.mkstemp()
        app.config['TESTING'] = True
        self.app = app.test_client()
        db.drop_all()
        db.create_all()

        " Populate the db with some todos "
        todo1 = Todo(title='do stuff')
        todo2 = Todo(title='do more stuff')
        todo3 = Todo(title='do even more stuff')
        db.session.add(todo1)
        db.session.add(todo2)
        db.session.add(todo3)
        db.session.commit()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(app.config['DATABASE'])

    def test_get(self):
        right_resp=dict()
        right_resp["todos"] = []
        right_resp["todos"].append({"done": False, "id": 1,"order": None, "title": "do stuff"})
        right_resp["todos"].append({"done": False, "id": 2,"order": None, "title": "do more stuff"})
        right_resp["todos"].append({"done": False, "id": 3,"order": None, "title": "do even more stuff"})
        
        response = self.app.get('/api/')
        response_dict = json.loads(response.data)
         
        self.assertEqual(right_resp,response_dict)

    def test_add_todo(self):
        data = dict(title="new todo item")
        response = self.app.post('/api/', data=json.dumps(data), 
        content_type='application/json') 
        response_dict = json.loads(response.data)

        right_resp=dict()
        right_resp['todo'] = dict()
        right_resp['todo']['title'] = 'new todo item';
        right_resp['todo']['done'] =  False;
        right_resp['todo']['order'] = None;
        right_resp['todo']['id'] = 4;
        
        print response_dict
        self.assertEqual(right_resp,response_dict)


if __name__ == '__main__':
    unittest.main()

    