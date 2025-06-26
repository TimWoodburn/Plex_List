import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///media_cache.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PLEX_URL = os.getenv('PLEX_URL')
    PLEX_TOKEN = os.getenv('PLEX_TOKEN')
