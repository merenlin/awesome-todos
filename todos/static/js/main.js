require(['lib/jquery', 'lib/underscore', 'lib/backbone', 'template','todos'], function() {
    $(document).ready(function() {
        window.App = new TodoApp();
    });
});