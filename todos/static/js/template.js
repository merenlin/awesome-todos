(function($) {
    var cache = {};
    
    function _render(elt, template, data, callback) {
        var data = data || {},
            callback = callback || function() {},
            html = template(data);
        
        elt.html(html);
        callback();
    }
    
    $.fn.template = function(path, obj, callback) {
        var self = this;
        
        if (cache[path]) {
            _render(self, cache[path], obj, callback);
            return self;
        }
        
        $.get(path, function(data) {
            cache[path] = _.template(data);
            _render(self, cache[path], obj, callback);
        });
        
        return self;
    };
})(jQuery);