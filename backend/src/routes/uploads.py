"""
File upload routes
"""
from flask import Blueprint, send_from_directory
from src.routes.utils import UPLOAD_FOLDER

uploads_bp = Blueprint('uploads', __name__)


@uploads_bp.route('/api/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded images"""
    return send_from_directory(UPLOAD_FOLDER, filename)

