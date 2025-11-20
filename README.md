# PlexList

**PlexList** is a web-based viewer for your Plex library. It reads TV shows and movie data from the Plex database and displays it in a sortable, filterable frontend built with React and Tailwind.

---

## 🔧 Features

- **Media Display**
  - Lists **TV Shows** and **Movies**
  - Columns: Title, Media Type, Library Section, Year, Rating, Summary, Seasons, Episodes, Date Added

- **Export List (PDF)**
  - Button: `Export List` next to the type filter
  - Exports the **current filtered view** of the table to a cleanly formatted PDF
  - Auto-adjusts to any new or removed columns

- **Filtering & Sorting**
  - Filter by media type: TV, Movie, or All
  - Sortable by title (other sort options may be added later)

- **Data Sync**
  - Backend syncs with Plex to populate the database
  - Full and partial refreshes supported

- **Dockerized**
  - One-click Docker Compose deployment
  - All dependencies (including PDF export) bundled in the container

---

## UI Guide

| Element         | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| **Type Filter** | Dropdown to filter view by `All`, `TV`, or `Movie`                         |
| **Export List** | Button that downloads a PDF of the current table view (uses `jsPDF`)       |
| **Table**       | Main display with title, metadata, and sortable headers                    |
| **Refresh**     | Sync data with Plex (Full or Partial refresh from backend)                 |

---

## Getting Started

### 1. Clone and Run via Docker

```bash
git clone https://github.com/TimWoodburn/Plex_List.git
cd Plex_List
```
Now rename the .env.example to .env and edit the file to include the URL and port of your plex server along with the API key for your Plex server.  You should only have to do this once.

```bash
docker compose up --build
```



### 2. Frontend URL

Visit: [http://localhost:3000](http://localhost:3000)

Or wherever your Docker contaier is executing. The supplied docker-compose.yml file set to port 5000.
---


## Technologies

- **Frontend:** React, TailwindCSS, Vite
- **Backend:** Flask (Python), SQLAlchemy, SQLite
- **Export:** jsPDF (PDF generation)
- **Containerization:** Docker

---

## Version

**v1.0 (Initial Operating Capability)**  
Includes full media sync, filtering, PDF export, and UI controls.

---

## Folder Structure (Important Parts)

```
PlexList/
├── frontend/
│   ├── App.jsx         # Main React app
│   ├── Dockerfile      # Frontend Docker container
│   └── ...
├── backend/
│   ├── plex_sync.py    # Full + partial sync logic
│   ├── models.py       # MediaItem model
│   ├── ...
├── docker-compose.yml
└── README.md           # You're here
```

---

## Roadmap Ideas

- Add episode-level detail rows
- More export formats (CSV, Excel)
- More sortable columns
- UI themes

---

## Maintainer

Built by Tim for Plex personal media collections.

---
