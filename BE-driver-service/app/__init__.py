from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from config import Config

APP = Flask(__name__)
APP.config.from_object(Config)

db = SQLAlchemy(APP)
migrate = Migrate(APP, db)
