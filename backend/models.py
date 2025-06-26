from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class MediaItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    media_type = db.Column(db.String, nullable=False)  # derived from library_section_title
    library_section_title = db.Column(db.String, nullable=False)  # e.g., "TV Shows", "Films"
    year = db.Column(db.Integer)
    rating = db.Column(db.String)
    summary = db.Column(db.Text)
    rating_key = db.Column(db.String, unique=True)
    added_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    seasons = db.Column(db.Integer, default=0)
    episodes = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "media_type": self.media_type,
            "library_section_title": self.library_section_title,
            "year": self.year,
            "rating": self.rating,
            "summary": self.summary,
            "rating_key": self.rating_key,
            "added_at": self.added_at.isoformat() if self.added_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "seasons": self.seasons,
            "episodes": self.episodes
        }
