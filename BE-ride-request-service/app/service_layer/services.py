import jwt
from app import APP
from app.repositories import DeviceLocationRepository, DriverSessionRepository
from redis import DataError
from abc import ABC, abstractmethod

class ServiceException(Exception):
    pass


class DriverHandleService:
    @classmethod
    def add_driver_session(self, driver_id, session_id, driver_session_repo: DriverSessionRepository):
        if not driver_id:
            raise ValueError(f"Driver_id not found")
        if not session_id:
            raise ValueError(f"Session_id not found") 
        try: 
            driver_session_repo.add(session_id, driver_id)
        except DataError as e:
            raise ServiceException(str(e))


    @classmethod
    def remove_driver_session(self, session_id, driver_session_repo: DriverSessionRepository, device_location_repo: DeviceLocationRepository):
        driver_session_repo.remove(session_id)
        device_location_repo.remove(session_id)

    @classmethod
    def update_driver_location(self, longitude, latitude, driver_id, driver_location_repo):
        driver_location_repo.add(longitude, latitude, driver_id)


    @classmethod
    def find_nearby_drivers(self, pickup_location, device_location_repo: DeviceLocationRepository, radius=5, unit='km'):
        nearby_devices = device_location_repo.list_by_geo_radius(pickup_location['longitude'], pickup_location['latitude'], radius, unit)
        return nearby_devices


class RideHandleService:
    @classmethod
    def handle_accept_ride(self, driver_id, ride_id, ride_repo):
        ride = ride_repo.get_by_id(ride_id)
        ride.driver_id = driver_id
        ride.status = 'in_progress'
        
    @classmethod
    def calculate_fare(self, ride):
        if ride.is_car_ride:
            strategy = CarStrategy(ride)
        else:
            strategy = BikeStrategy(ride)
        return strategy.calculate()


class FareStrategy(ABC):
    @abstractmethod
    def calculate(self):
        pass
        

class BikeStrategy(FareStrategy):
    def __init__(self, ride):
        self.base = 1000
        self.ride = ride
        
    def calculate(self):
        distance = 100
        amount = distance * self.base 
        return {'amount': fare, 'currency': 'VND'}

class CarStrategy(FareStrategy):
    def __init__(self, ride):
        self.base = 5000
        self.ride = ride

    def calculate(self):
        distance = 100
        amount = distance * self.base
        return {'amount': amount, 'currency': 'VND'}
        

    