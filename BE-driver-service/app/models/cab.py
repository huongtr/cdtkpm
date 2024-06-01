
import datetime as dt
from app import db

class Cab(db.Model):
    __tablename__ = 'cabs'

    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), unique=True, nullable=False)
    license_plate = db.Column(db.String(20), nullable=False)
    make = db.Column(db.String(20), nullable=False)
    model = db.Column(db.String(20), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=dt.datetime.utcnow)


    def __init__(self, driver_id, license_plate, make, model, year):
        self.driver_id = driver_id
        self.license_plate = license_plate
        self.make = make
        self.model = model
        self.year = year

    # The __repr__ method tells Python how to print objects of this class,
    # which is going to be useful for debugging.
    def __repr__(self):
        return f"<Cab {self.id}>"
