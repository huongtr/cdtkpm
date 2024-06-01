import datetime as dt
from app import db

class Ride(db.Model):
    __tablename__ = 'rides'

    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    pickup_latitude = db.Column(db.Float)
    pickup_longitude = db.Column(db.Float)
    dropoff_latitude = db.Column(db.Float)
    dropoff_longitude = db.Column(db.Float)
    status = db.Column(db.String(50))  # e.g., 'requested', 'accepted', 'ongoing', 'completed'
    vehicle_type = db.Column(db.String)
    fare_amount = db.Column(db.Float)
    ride_start_time = db.Column(db.DateTime)
    ride_end_time = db.Column(db.DateTime)
    user_sid = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=dt.datetime.utcnow)


    def __init__(self, user_id, pickup_latitude, pickup_longitude,
                 dropoff_latitude, dropoff_longitude, vehicle_type, fare_amount=None,
                 ride_start_time=None, ride_end_time=None, status='requested', driver_id=None, user_sid=None):
        self.driver_id = driver_id
        self.user_id = user_id
        self.pickup_latitude = pickup_latitude
        self.pickup_longitude = pickup_longitude
        self.dropoff_latitude = dropoff_latitude
        self.dropoff_longitude = dropoff_longitude
        self.status = status
        self.fare_amount = fare_amount
        self.vehicle_type = vehicle_type
        self.ride_start_time = ride_start_time
        self.ride_end_time = ride_end_time
        self.user_sid = user_sid

    # The __repr__ method tells Python how to print objects of this class,
    # which is going to be useful for debugging.
    def __repr__(self):
        return f"<Ride {self.id}>"


    def is_acceptable(self):
        if self.status != 'requested':
            return False

        now = dt.datetime.now()
        time_difference = now - self.created_at
        return time_difference <= dt.timedelta(minutes=1)


    def get_distance(self):
        distance = ''
        return distance


    def is_car_ride(self):
        self.vehicle_type == 'car'

    def is_bike_ride(self):
        self.bike_type == 'bike'
