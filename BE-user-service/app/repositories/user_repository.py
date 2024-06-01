from app.models import User
from app import db

class UserRepository:
    def __init__(self):
        pass

    def get_users(self):
        # Example query
        users = db.session.query(User).all()
        return users

    def add_user(self, user):
        db.session.add(user)
        db.session.commit()

    def create_user(self, username, mobile_phone, password, first_name, last_name):
        user = User(username=username, mobile_phone=mobile_phone, password=password, first_name=first_name, last_name=last_name)
        db.session.add(user)
        db.session.commit()
        return user

    def get_user_by_id(self, user_id):
        return User.query.filter_by(id=user_id).first()

    def get_user_by_username(self, username):
        return User.query.filter_by(username=username).first()

    def delete_user(self, user):
        db.session.delete(user)
        db.session.commit()