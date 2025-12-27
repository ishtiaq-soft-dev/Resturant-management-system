"""
User schemas for serialization/validation
"""
from marshmallow import Schema, fields, validate


class UserSchema(Schema):
    """User schema for serialization"""
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=20))
    email = fields.Email(required=True)
    role = fields.Str(validate=validate.OneOf(['customer', 'admin']))
    address = fields.Str(allow_none=True)


class UserRegisterSchema(Schema):
    """Schema for user registration"""
    username = fields.Str(required=True, validate=validate.Length(min=3, max=20))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    address = fields.Str(allow_none=True)
    role = fields.Str(validate=validate.OneOf(['customer', 'admin']))


class UserLoginSchema(Schema):
    """Schema for user login"""
    email = fields.Email(required=True)
    password = fields.Str(required=True)

