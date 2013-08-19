(function() {
    var TEMPLATE_URL = 'static';
    
    var Todo = Backbone.Model.extend({

        defaults: function() {
            return {
                title: '',
                done:  false,
                order: 0
            };
        },

        toggle: function() {
            this.save({done: !this.get("done")});
        }

    });

    var TodoList = Backbone.Collection.extend({

        model: Todo,
        
        url: '/api/',

        done: function() {
            return this.filter(function(todo) { return todo.get('done'); });
        },

        remaining: function() {
            return this.without.apply(this, this.done());
        },
        
        nextOrder: function() {
            if (!this.length) { 
                return 1; 
            }
            
            return this.last().get('order') + 1;
        },

        comparator: function(todo) {
            return todo.get('order');
        },

        // Backbone collection expects data to be an array
        // Flask does not agree, so we need to parse
        parse: function(data) {
    		return data.todos;
  		}

    });

    var TodoView = Backbone.View.extend({

        tagName:  "li",

        events: {
            "click .check"              : "toggleDone",
            "dblclick div.todo_title"    : "edit",
            "keypress .todo_input"      : "updateOnEnter"
        },

        initialize: function() {
            this.model.bind('change', this.render, this);
        },

        render: function() {
        	console.log("render TodoView")
            var self = this;
            console.log(self.model.toJSON());
            $(self.el).template(TEMPLATE_URL + '/templates/item.html', self.model.toJSON(), function() {
            	console.log("load item tpl")
                self.setTitle();
            });
            
            return this;
        },

        setTitle: function() {
            var title = this.model.get('title');
            console.log("set title TodoView")
            console.log(title)
            this.$('.todo_title').text(title);
            this.input = this.$('.todo_input');
            this.input.bind('blur', _.bind(this.close, this)).val(title);
        },

        toggleDone: function() {
            this.model.toggle();
        },

        edit: function() {
            $(this.el).addClass("editing");
            this.input.focus();
        },

        close: function() {
            this.model.save({title: this.input.val()});
            $(this.el).removeClass("editing");
        },

        updateOnEnter: function(e) {
            if (e.keyCode === 13) { this.close(); }
        },

        remove: function() {
            $(this.el).remove();
        },

        clear: function() {
            this.model.destroy();
        }

    });

    window.TodoApp = Backbone.View.extend({
        
        el: $("#todos_app"),
        
        todos: new TodoList(),

        events: {
            "keypress #todo_title":  "createOnEnter",
            "click .todo_clear a": "clearCompleted",
            "click #add_button a": "createOnBtn",
        },

        initialize: function() {
        	this.todos.fetch();
        	console.log("initialize TodoApp")
            this.input = this.$("#todo_title");

            this.todos.bind('add',   this.addOne, this);
            this.todos.bind('reset', this.addAll, this);
            this.todos.bind('all',   this.render, this);
            this.delegateEvents();
            
        },


        render: function() {

            var self = this,
                data = {
                    total:      self.todos.length,
                    done:       self.todos.done().length,
                    remaining:  self.todos.remaining().length
                };
            console.log("loading stats")
            console.log("todos")
            console.log(this.todos.toJSON())
            this.$('#todo_stats').template(TEMPLATE_URL + '/templates/stats.html', data);
            console.log("rendered the page")
            return this;
        },

        addOne: function(todo) {
        	console.log("addOne");
        	console.log("todo being added")
        	console.log(todo.toJSON())
            var view = new TodoView({model: todo});
            this.$("#todo_list").append(view.render().el);
        },

        addAll: function() {
        	console.log("addALl")
            this.todos.each(this.addOne);
        },

        createOnEnter: function(e) {
        	console.log("createOnEnter")
            var title = this.input.val();
            
            if (!title || e.keyCode !== 13) {
                return;
            }
            
            this.todos.create({title: title, order: this.todos.nextOrder()});
            this.input.val('');
        },

        createOnBtn: function(e) {
        	console.log("createOnBtn")
            var title = this.input.val();
            
            if (!title) {
                return;
            }
            
            this.todos.create({title: title, order: this.todos.nextOrder()});
            this.input.val('');
        },

        clearCompleted: function() {
            _.each(this.todos.done(), function(todo) { todo.destroy(); });
            return false;
        },
        
    });
    
}());
