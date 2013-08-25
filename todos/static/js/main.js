require(['lib/jquery', 'lib/underscore', 'lib/backbone', 'lib/jquery-ui','template','todos'], function() {
    $(document).ready(function() {
        window.App = new TodoApp();
    });
});