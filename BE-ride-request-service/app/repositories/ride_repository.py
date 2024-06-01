from .abstract_repository import AbstractRepository
from app.models.ride import Ride

class RideRepository:
    def __init__(self, session):
        self.session = session

    def list(self):
        return self.session.query(Ride).all()

    def add(self, ride):
        self.session.add(ride)

    def get_by_id(self, id):
        return Ride.query.filter_by(id=id).first()
