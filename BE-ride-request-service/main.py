import logging
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import APP, socketio, db
from app.views import routes

# for flask console - flask shell
@APP.shell_context_processor
def make_shell_context():
    return {'sa': sa, 'so': so, 'db': db}

if __name__ == "__main__":
    socketio.run(APP, debug=True)