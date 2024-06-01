from flask import render_template, jsonify, request
from marshmallow import ValidationError
from app import APP, db
from app.models import Driver, Cab
from app.schemas import DriverSchema, CabSchema
from app.service_layer import services
from app.repositories import DriverRepository, CabRepository

driver_schema = DriverSchema()
cab_schema = CabSchema()

@APP.route('/')
@APP.route('/index')
def index():
    driver = {'username': 'Driver', 'mobile_phone': 1234, 'password': 'secret123'}
    return render_template('index.html', title='Home', driver=driver)


@APP.route('/signup', methods=['POST'])
def signup():
    try:
        driver_data = driver_schema.load(request.json.get('driver'))
        cab_data = cab_schema.load(request.json.get('cab'))
    except ValidationError as e:
        return jsonify({'error': e.messages}), 400

    try:
        session = db.session
        driver_repo = DriverRepository(session)
        cab_repo = CabRepository(session)
        driver, cab = services.register_driver_with_cab(driver_data, cab_data, session, driver_repo, cab_repo)

        return jsonify({
            'message': 'Driver created successfully',
            'data': {'driver_id': driver.id, 'cab_id': cab.id}
            }), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400



@APP.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    driver_repo = DriverRepository(db.session)
    driver = services.login_driver(username, password, driver_repo)
    if driver:
        # Generate JWT token or set session cookie
        return jsonify({
            'message': 'Logged in successfully',
            'data': {
                'id': driver.id,
                'first_name': driver.first_name,
                'last_name': driver.last_name,
                'token': services.generate_jwt(driver)
                }
            }), 201
    else:
        return jsonify({'error': 'Invalid username or password'}), 401
