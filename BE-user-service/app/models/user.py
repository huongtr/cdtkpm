import datetime as dt
from sqlalchemy.orm import relationship
from app import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, index=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    mobile_phone = db.Column(db.String, index=True)
    password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=dt.datetime.utcnow)

    # driver = relationship("Driver", back_populates="user", uselist=False)
    # passenger = relationship("Passenger", back_populates="user", uselist=False)

    def __init__(self, username, mobile_phone, password, first_name, last_name):
        self.username = username
        self.mobile_phone = mobile_phone
        self.password_hash = generate_password_hash(password)
        self.first_name = first_name
        self.last_name = last_name

    # The __repr__ method tells Python how to print objects of this class,
    # which is going to be useful for debugging.
    def __repr__(self):
        return f"<User {self.id}>"

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
