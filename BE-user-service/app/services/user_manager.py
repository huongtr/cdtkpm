import jwt
from app import APP
from app.repositories.user_repository import UserRepository

class UserManager:

    def __init__(self):
        self.user_repository = UserRepository()

    def register_user(self, username, mobile_phone, password, first_name, last_name):
        user = self.user_repository.get_user_by_username(username)
        if user:
            raise ValueError(f"User '{username}' already exists")
        user = self.user_repository.create_user(username, mobile_phone, password, first_name, last_name)
        return user

    def login_user(self, username, password):
        user = self.user_repository.get_user_by_username(username)
        if user:
            if user.check_password(password):
                return user


    def get_user(self, user_id):
        user = self.user_repository.get_user_by_id(user_id)
        return user

    def generate_jwt(self, user):
        token = jwt.encode({"id": user.id}, APP.config["JWT_SECRET_KEY"], algorithm="HS256")
        return token



