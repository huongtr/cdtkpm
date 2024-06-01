from app.models import Driver
from .abstract_repository import AbstractRepository

class DriverRepository(AbstractRepository):
    def __init__(self, session):
        self.session = session

    def list(self):
        drivers = self.session.query(Driver).all()
        return drivers

    def add(self, driver):
        self.session.add(driver)

    def get_by_id(self, id):
        return Driver.query.filter_by(id=id).first()

    def get_by_username(self, username):
        return Driver.query.filter_by(username=username).first()
