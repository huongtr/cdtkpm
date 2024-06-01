import sqlalchemy as sa
import sqlalchemy.orm as so
from app import APP, db
from app.models import User
from app.views import routes


@APP.shell_context_processor
def make_shell_context():
    return {'sa': sa, 'so': so, 'db': db, 'User': User}

if __name__ == "__main__":
  APP.run(debug=True, host='0.0.0.0')