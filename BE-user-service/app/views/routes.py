from flask import render_template, jsonify, request
from marshmallow import ValidationError
from app import APP
from app.schemas.user_schema import UserSchema
from app.models.user import User
from app.services.user_manager import UserManager
from app.schemas.user_schema import UserSchema


user_manager = UserManager()
user_schema = UserSchema()


@APP.route('/')
@APP.route('/index')
def index():
    user = {'username': 'Miguel', 'mobile_phone': 1234, 'password': 'secret123'}
    return render_template('index.html', title='Home', user=user)


@APP.route('/signup', methods=['POST'])
def signup():
    try:
        user_data = user_schema.load(request.json)
    except ValidationError as e:
        return jsonify({'error': e.messages}), 400

    try:
        user = user_manager.register_user(**user_data)
        return jsonify({
            'message': 'User created successfully',
            'data': {'id': user.id}
            }), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@APP.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = user_manager.login_user(username, password)
    if user:
        # Generate JWT token or set session cookie
        return jsonify({
            'message': 'Logged in successfully',
            'data': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'token': user_manager.generate_jwt(user)
                }
            }), 201
    else:
        return jsonify({'error': 'Invalid username or password'}), 401


@APP.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = user_manager.get_user(user_id)
    if user:
        return jsonify({
            'data': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'mobile_phone': user.mobile_phone
                }
            }), 200
    else:
        return jsonify({'error': 'User not found'}), 404
