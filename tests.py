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
        right_resp['title'] = 'new todo item';
        right_resp['done'] =  False;
        right_resp['order'] = None;
        right_resp['id'] = 4;
        
        self.assertEqual(right_resp,response_dict)

    def test_update_todo(self):
        data = dict()
        data['title'] = 'new title';
        data['done'] =  False;
        data['order'] = 1;

        todo_testid = 1
        response = self.app.put('/api/'+str(todo_testid), data=json.dumps(data), 
        content_type='application/json')
        response_dict = json.loads(response.data)

        self.assertEqual(dict(response='OK'),response_dict)
        
        todos = Todo()
        todo = todos.get(todo_testid)
        self.assertEqual(todo['title'],data['title'])
        self.assertEqual(todo['order'],data['order'])

if __name__ == '__main__':
    unittest.main()

    