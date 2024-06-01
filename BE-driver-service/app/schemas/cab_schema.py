from marshmallow import Schema, fields, validate

class CabSchema(Schema):
    id = fields.Int(dump_only=True)  # dump_only makes this field read-only during serialization
    license_plate = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    make = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    model = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    year = fields.Int(required=True, validate=validate.Range(min=1900, max=2100))
