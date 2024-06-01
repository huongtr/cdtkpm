import redis
from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from config import Config

APP = Flask(__name__)
socketio = SocketIO(APP, cors_allowed_origins="*")
APP.config.from_object(Config)

db = SQLAlchemy(APP)
redis_client = redis.StrictRedis(host=APP.config['REDIS_HOST'], port=APP.config['REDIS_PORT'], db=APP.config['REDIS_DB'])
migrate = Migrate(APP, db)