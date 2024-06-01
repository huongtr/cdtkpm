import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.flaskenv'))


class Config:
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DB_URL') or 'postgresql://postgres:secret123@localhost:5416/uber_driver'
    REDIS_HOST = os.environ.get('REDIS_HOST') or 'localhost'
    REDIS_PORT = os.environ.get('REDIS_PORT') or '6379'
    REDIS_DB = os.environ.get('REDIS_DB') or '0'


class ProductionConfig(Config):
    DEBUG = False
