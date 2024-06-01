from flask import render_template, jsonify, request
from marshmallow import ValidationError
from flask_socketio import emit
from app import APP, socketio, db, redis_client
from app.service_layer.services import DriverHandleService, RideHandleService
from app.repositories import DeviceLocationRepository, DriverSessionRepository, RideRepository
from app.models import Ride
from app.schemas import RideSchema

ride_schema = RideSchema()

def emit_error(socketio, code, msg):
    socketio.emit('error', {
        'type': 'error',
        'code': code or 500,
        'message': msg or 'Unknown'
    })

# Test view of Driver
@APP.route('/')
@APP.route('/index')
def index():
    driver = {'username': 'Driver', 'mobile_phone': 1234, 'password': 'secret123'}
    return render_template('index.html', title='Home', driver=driver)

# Test view of User
@APP.route('/user')
def user_page():
    user = {'username': 'User', 'mobile_phone': 1234, 'password': 'secret123'}
    return render_template('user_page.html', title='UserTest', user=user)


# Restful APIs
@APP.route('/rides/estimate-fare', methods=['GET'])
def estimate_fare():
    data = request.args
    try:
        ride_data = ride_schema.load(data)
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    ride = Ride(**ride_data)
    result = RideHandleService.calculate_fare(ride)
    return jsonify(result), 200


@APP.route('/rides/request', methods=['POST'])
def request_ride():
    data = request.json
    print('data', data)
    try:
        ride_data = ride_schema.load(data)
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

    # create ride
    session = db.session
    ride_repo = RideRepository(session)
    ride = Ride(**data)
    ride.status = 'requested'
    fare = RideHandleService.calculate_fare(ride)
    ride.fare_amount = fare['amount']
    ride_repo.add(ride)
    session.commit()

    device_location_repo = DeviceLocationRepository(redis_client)
    pickup_location = {
        'longitude': data['pickup_longitude'],
        'latitude': data['pickup_latitude']
    }
    dropoff_location = {
        'longitude': data['dropoff_longitude'],
        'latitude': data['dropoff_latitude']
    }
    nearby_devices = DriverHandleService.find_nearby_drivers(pickup_location, device_location_repo)

    if not nearby_devices:
        print("No drivers")
        return jsonify({
                'success': False,
                'message': 'No drivers available at this time.'
            }), 201

    # broadcast ride request
    for device in nearby_devices:
        sid = device[0].decode('utf-8')
        print('Sending ride request to driver', sid)
        socketio.emit('ride_requested', {'ride_id': ride.id, 'pickup_location': pickup_location, 'dropoff_location': dropoff_location}, room=sid)
    return jsonify({
            'success': True,
            'message': 'Ride is created, searching for drivers',
            'data': ride_schema.dump(ride)
            }), 201


# Websockets
# websocket connect when driver login successfully
# TODO: authenticate with jwt token
@socketio.on('connect')
def connect():
    emit('connected', {'sid': request.sid})

@socketio.on('add_session')
def add_session(message):
    driver_id = message['driver_id']
    session_id = request.sid
    driver_session_repo = DriverSessionRepository(redis_client)
    try:
        DriverHandleService.add_driver_session(driver_id, session_id, driver_session_repo)
        print(f"Driver {driver_id} added")
    except Exception as e:
        print(str(e))
        emit_error(socketio, 401, str(e))


# websocket disconnect when driver logout
# TODO: authenticate with jwt token
@socketio.on('disconnect')
def disconnect():
    print("Disconnect")
    sid = request.sid
    driver_session_repo = DriverSessionRepository(redis_client)
    device_location_repo = DeviceLocationRepository(redis_client)
    try:
        DriverHandleService.remove_driver_session(sid, driver_session_repo, device_location_repo)
        print(f"Session {sid} removed")
    except ValueError as e:
        print(str(e))


# websocket for connected drivers to update location every 1 minute
# TODO: authenticate with jwt token
@socketio.on('update_location')
def handle_update_location(message):
    sid = request.sid
    device_location_repo = DeviceLocationRepository(redis_client)
    device_location_repo.add(message['longitude'], message['latitude'], sid)
    print(f"Location updated {sid} {message['longitude']} {message['latitude']}")


# websocket
# TODO: authenticate with jwt token
@socketio.on('accept_ride')
def handle_accept_ride(message):
    sid = request.sid
    ride_id = int(message['ride_id'])
    print(ride_id)
    driver_session_repo = DriverSessionRepository(redis_client)
    driver_id = driver_session_repo.get_driver(sid)
    if driver_id is None:
        emit_error(socketio, 401, 'Driver not found')

    session = db.session
    session.begin_nested()
    ride_repo = RideRepository(session)
    ride = ride_repo.get_by_id(ride_id)

    if ride and ride.is_acceptable:
        try:
            ride.driver_id = driver_id
            ride.status = 'accepted'
            session.commit
            user_sid = ride.user_sid
            emit('request_accepted', ride_schema.dump(ride), room=user_sid) # send to user
            emit('request_accepted', ride_schema.dump(ride), room=sid) # send to driver
            print('Request accepted, user_sid: ', user_sid)
        except Exception as e:
            session.rollback()
            emit_error(socketio, 500, str(e))
    else:
        emit_error(socketio, 401, 'Ride not able to accept')

