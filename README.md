To run the app: 

1. Install all the dependencies

    cd awesome-todos

    sudo pip install -r dependencies.txt

2. Launch the server

    python runserver.py

3. Open http://127.0.0.1:8000/ in your browser


Current limitations: 


1. Marking all of the todos as complete and changing the order
is implemented in a naive way. To do this more efficient 
one needs to group update requests into chunks and do it without
blocking the UI. 

2. Sometimes on the reload of the page javascript libraries don't 
get loaded before the main code, causing an error. Needs investigation.

3. Long title of the todo item does not get automatically cropped

4. Mark all incomplete button should be implemented and appear
after marking all items complete was done. 

5. Removing a todo should be possible by dragging it away from 
the page/trashcan


Technical Backlog: 

1. Fix unittests, they are messing with production database

2. Refactor the Selenium tests and push

3. Test the layout in different browsers (now checked in Chrome for Mac 28.0)

....
