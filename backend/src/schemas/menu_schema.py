"""
Menu item schemas
"""
from marshmallow import Schema, fields, validate


class MenuItemSchema(Schema):
    """Menu item schema"""
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(max=100))
    description = fields.Str(allow_none=True, validate=validate.Length(max=500))
    price = fields.Float(required=True, validate=validate.Range(min=0))
    category = fields.Str(required=True, validate=validate.Length(max=50))
    image_url = fields.Str(allow_none=True)
    is_deal = fields.Bool()
    availability = fields.Bool()

