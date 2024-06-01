from marshmallow import Schema, fields, validate

class RideSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    driver_id = fields.Int(allow_none=True)
    pickup_latitude = fields.Float(required=True)
    pickup_longitude = fields.Float(required=True)
    dropoff_latitude = fields.Float(required=True)
    dropoff_longitude = fields.Float(required=True)
    status = fields.Str()
    fare_amount = fields.Float()
    vehicle_type = fields.Str()
    ride_start_time = fields.DateTime(allow_none=True)
    ride_end_time = fields.DateTime(allow_none=True)
    user_sid = fields.Str(allow_none=True)
