from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from models import db, MediaItem
from plex_sync import full_sync_with_plex, partial_sync_with_plex

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///plexlist.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Automatically create tables if they don't exist
with app.app_context():
    db.create_all()

@app.route('/api/refresh/full', methods=['POST'])
def refresh_full():
    full_sync_with_plex()
    return jsonify({'message': 'Full refresh completed'}), 200

@app.route('/api/refresh/partial', methods=['POST'])
def refresh_partial():
    partial_sync_with_plex()
    return jsonify({'message': 'Partial refresh completed'}), 200

@app.route('/api/media', methods=['GET'])
def get_all_media():
    media_type = request.args.get('type')  # 'movie', 'show', or None
    query = MediaItem.query
    if media_type in ['movie', 'show']:
        query = query.filter_by(type=media_type)
    results = query.order_by(MediaItem.title.asc()).all()
    return jsonify([item.to_dict() for item in results]), 200

@app.route('/api/media/limited', methods=['GET'])
def get_limited_media():
    media_type = request.args.get('type')
    query = MediaItem.query
    if media_type in ['movie', 'show']:
        query = query.filter_by(type=media_type)
    results = query.order_by(MediaItem.title.asc()).limit(10).all()
    return jsonify([item.to_dict() for item in results]), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
