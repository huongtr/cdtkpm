import jwt
from app import APP
from app.models import Driver, Cab
from app.repositories import DriverRepository, CabRepository

class ServiceException(Exception):
    pass

def register_driver(driver_data, session, driver_repo: DriverRepository):
    username = driver_data['username']
    driver = driver_repo.get_by_username(username)
    if driver:
        raise ValueError(f"Driver '{username}' already exists")

    driver = Driver(**driver_data)
    driver_repo.add(driver)
    session.commit()
    return driver


def register_driver_with_cab(driver_data, cab_data, session, driver_repo, cab_repo):
    driver = driver_repo.get_by_username(driver_data['username'])
    if driver:
        raise ValueError(f"Driver '{driver_data['username']}' already exists")

    try:
        # Create a new driver
        driver = Driver(**driver_data)
        driver_repo.add(driver)
        # Assign driver_id to cab_data
        session.flush()
        cab_data['driver_id'] = driver.id

        # Create a new cab associated with the driver
        cab = Cab(**cab_data)
        cab_repo.add(cab)

        session.commit()
        return driver, cab
    except Exception as e:
        session.rollback()
        raise e

def login_driver(username, password, driver_repo):
    driver = driver_repo.get_by_username(username)
    if driver:
        if driver.check_password(password):
            return driver


def generate_jwt(driver):
    token = jwt.encode({"id": driver.id}, APP.config["JWT_SECRET_KEY"], algorithm="HS256")
    return token

