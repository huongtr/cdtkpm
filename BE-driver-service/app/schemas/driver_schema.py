from marshmallow import Schema, fields, validate

class DriverSchema(Schema):
    id = fields.Int(dump_only=True)  # dump_only makes this field read-only during serialization
    username = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    first_name = fields.Str()
    last_name = fields.Str()
    mobile_phone = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=6))  # load_only ensures this field is only used during deserialization
    