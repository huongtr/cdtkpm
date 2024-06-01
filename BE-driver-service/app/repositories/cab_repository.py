from app.models import Cab
from .abstract_repository import AbstractRepository

class CabRepository:
    def __init__(self, session):
        self.session = session

    def list(self):
        cabs = self.session.query(Cab).all()
        return cabs

    def add(self, cab):
        self.session.add(cab)

    def get_by_id(self, id):
        return Cab.query.filter_by(id=id).first()
