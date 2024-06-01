import logging
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import APP, db
from app.models import Driver
from app.views import routes


# for flask console - flask shell
@APP.shell_context_processor
def make_shell_context():
    return {'sa': sa, 'so': so, 'db': db, 'Driver': Driver}

if __name__ == "__main__":
  APP.run(debug=True, host='0.0.0.0')

