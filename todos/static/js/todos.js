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
        	console.log(this.length)
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
        className: 'ui-state-default',
        attributes: function() {
  			return {
    			"data-id": this.model.id
  			};
		},

        events: {
            "click .check"              : "toggleDone",
            "dblclick div.todo_title"    : "edit",
            "click span.todo-destroy"   : "clear",
            "keypress .todo_input"      : "updateOnEnter"
        },

        initialize: function() {
            this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
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
        
        todos: new TodoList({parse:true}),

        isSyncing: false,
 
   		orderAttr: 'order',
 

        events: {
            "keypress #todo_title":  "createOnEnter",
            "click .todo_clear a": "markAllComplete",
            "click #add_button a": "createOnBtn",
            'sortupdate':  'handleSortComplete',
        },

        initialize: function() {
        	var self = this;
            self.el = $('#todos_app');
            self.delegateEvents();
                
            self.input = self.$("#todo_title");

            self.todos.bind('add',   self.addOne, self);
            self.todos.bind('reset', self.addAll, self);
            self.todos.bind('all',   self.render, self);
            self.todos.bind('sync reset', self.listSync, self);

            self.listSync();
            self.todos.fetch();
        },


        render: function() {
            var self = this,
                data = {
                    total:      self.todos.length,
                    done:       self.todos.done().length,
                    remaining:  self.todos.remaining().length
                };
            this.$('#todo_stats').template(TEMPLATE_URL + '/templates/stats.html', data);
            this.$( ".ui-sortable" ).sortable();
    		this.$( ".ui-sortable" ).disableSelection();
  
            //this.$el.sortable({ containment: 'parent', tolerance: 'pointer' });
            return this;
        },

        addOne: function(todo) {
            var view = new TodoView({model: todo});
            this.$("#todo_list").append(view.render().el);
        },

        addAll: function() {
            this.todos.each(this.addOne);
        },

        createOnEnter: function(e) {
            var title = this.input.val();
            
            if (!title || e.keyCode !== 13) {
                return;
            }
            
            this.todos.create({title: title, order: this.todos.nextOrder()});
            this.input.val('');
        },

        createOnBtn: function(e) {
            var title = this.input.val();
            
            if (!title) {
                return;
            }
            
            this.todos.create({title: title, order: this.todos.nextOrder()});
            this.input.val('');
        },

        markAllComplete: function() {
        	this.todos.each(function(todo){ if (!todo.get('done')) { todo.save({done: true}); }});
        },

        listSync: function () {
 		   this.isSyncing = true;

 		   // Remove the views 
 		   this.$("#todo_list").empty()
		   // Add all the views back
		   this.addAll();
		 
		   this.isSyncing = false;		 
		},

		handleSortComplete: function () {
 
		   var oatr = this.orderAttr;
		   var collection = this.todos;
		   todo_views = this.$("#todo_list").children(); 
		   todo_views.each(function(i,elm) {
		   		item_id = $(elm).data('id');
		   		// set new order to the models	
		   		item = collection.get(item_id);
		   		item.save({order:i});
		      });

		   this.todos.sort({silent: true});
		},
        
    });
    
}());
