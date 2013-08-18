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
        
        url: '/api',

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
            var self = this;
            
            $(self.el).template(TEMPLATE_URL + '/templates/item.html', self.model.toJSON(), function() {
                self.setTitle();
            });
            
            return this;
        },

        setTitle: function() {
            var title = this.model.get('title');
            console.log("set title")
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
            this.input = this.$("#todo_title");

            this.todos.bind('add',   this.addOne, this);
            this.todos.bind('reset', this.addAll, this);
            this.todos.bind('all',   this.render, this);
            this.delegateEvents();
            this.todos.fetch();
        },


        render: function() {
            var self = this,
                data = {
                    total:      self.todos.length,
                    done:       self.todos.done().length,
                    remaining:  self.todos.remaining().length
                };
            console.log("loading stats")
            console.log(this.todos)
            this.$('#todo_stats').template(TEMPLATE_URL + '/templates/stats.html', data);
            
            return this;
        },

        addOne: function(todo) {
        	console.log("addOne");
            var view = new TodoView({model: todo});
            this.$("#todo_list").append(view.render().el);
        },

        addAll: function() {
        	console.log("addALl")
        	console.log(this.todos)
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
