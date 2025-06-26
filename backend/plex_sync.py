# plex_sync.py
from plexapi.server import PlexServer
from models import db, MediaItem
from config import Config
from datetime import datetime

plex_url = Config.PLEX_URL
plex_token = Config.PLEX_TOKEN

# Normalize and map library names to internal media types
LIBRARY_TO_MEDIA_TYPE = {
    "tv shows": "tv",
    "films": "movie",
    "home movies": "home_movie"
}

def normalize_library_name(name):
    return name.strip().lower()

def extract_media_type(item):
    library_title = getattr(item, 'librarySectionTitle', 'Unknown')
    media_type = LIBRARY_TO_MEDIA_TYPE.get(normalize_library_name(library_title))
    return media_type, library_title

def full_sync_with_plex():
    print("[SYNC] Starting full sync with Plex...")
    plex = PlexServer(plex_url, plex_token)

    db.session.query(MediaItem).delete()
    print("[DB] Cleared MediaItem table.")

    for library in plex.library.sections():
        print(f"[LIBRARY] Found: '{library.title}' (type: {library.type})")

        items = library.all()
        for item in items:
            try:
                media_type, library_title = extract_media_type(item)
                if not media_type:
                    print(f"[SKIP] Unmapped library: '{library_title}'")
                    continue

                title = item.title
                year = item.year
                rating = getattr(item, 'contentRating', None)
                summary = getattr(item, 'summary', None)
                rating_key = str(item.ratingKey)
                added_at = getattr(item, 'addedAt', None)

                if media_type == "tv":
                    try:
                        seasons = len(item.seasons())
                        episodes = sum(len(season.episodes()) for season in item.seasons())
                    except Exception as e:
                        print(f"[WARN] Could not get episode counts for '{title}': {e}")
                        seasons, episodes = 0, 0
                else:
                    seasons, episodes = 0, 0

                media = MediaItem(
                    title=title,
                    year=year,
                    media_type=media_type,
                    rating=rating,
                    summary=summary,
                    rating_key=rating_key,
                    added_at=added_at,
                    seasons=seasons,
                    episodes=episodes,
                    library_section_title=library_title
                )
                db.session.add(media)
                print(f"[ADD] '{title}' ({media_type})")

            except Exception as ex:
                print(f"[ERROR] Failed to process item: {ex}")

    db.session.commit()
    print("[SYNC] Full sync complete.")

def partial_sync_with_plex():
    print("[SYNC] Starting partial sync with Plex...")
    plex = PlexServer(plex_url, plex_token)

    for library in plex.library.sections():
        items = library.all()
        for item in items:
            try:
                media_type, library_title = extract_media_type(item)
                if not media_type:
                    print(f"[SKIP] Unmapped library: '{library_title}'")
                    continue

                title = item.title
                year = item.year
                rating = getattr(item, 'contentRating', None)
                summary = getattr(item, 'summary', None)
                rating_key = str(item.ratingKey)
                added_at = getattr(item, 'addedAt', None)

                if media_type == "tv":
                    try:
                        seasons = len(item.seasons())
                        episodes = sum(len(season.episodes()) for season in item.seasons())
                    except Exception as e:
                        print(f"[WARN] Could not get episode counts for '{title}': {e}")
                        seasons, episodes = 0, 0
                else:
                    seasons, episodes = 0, 0

                existing = MediaItem.query.filter_by(rating_key=rating_key).first()
                if existing:
                    updated = False
                    if existing.seasons != seasons or existing.episodes != episodes:
                        existing.seasons = seasons
                        existing.episodes = episodes
                        updated = True
                    if existing.year != year:
                        existing.year = year
                        updated = True
                    if updated:
                        print(f"[UPDATE] Updated '{title}'")
                else:
                    new_media = MediaItem(
                        title=title,
                        year=year,
                        media_type=media_type,
                        rating=rating,
                        summary=summary,
                        rating_key=rating_key,
                        added_at=added_at,
                        seasons=seasons,
                        episodes=episodes,
                        library_section_title=library_title
                    )
                    db.session.add(new_media)
                    print(f"[ADD] New item '{title}'")

            except Exception as ex:
                print(f"[ERROR] Failed to process item: {ex}")

    db.session.commit()
    print("[SYNC] Partial sync complete.")
