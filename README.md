# CareerVault

CareerVault is a football career database designed to organize and preserve the history of multiple career mode saves.

The project allows users to manage independent save universes containing clubs, national teams, players, seasons, competitions, statistics, trophies, transfers and international call-ups.

> The project is currently under development.

## Purpose

Career mode saves can last for many seasons and generate a large amount of information that is difficult to preserve inside the game itself.

CareerVault aims to provide a centralized place to record and explore information such as:

* players and academy graduates;
* clubs and national teams;
* squads by season;
* statistics by competition;
* goals, assists, clean sheets and average ratings;
* trophies and individual awards;
* important matches;
* transfers and contracts;
* national team call-ups;
* comparisons and historical rankings.

Each save is stored as an independent universe, allowing different careers to coexist without mixing their data.

## Planned features

* [ ] Multiple save management
* [ ] Club and national team management
* [ ] Player creation and duplicate detection
* [ ] Bulk player creation
* [ ] Squad history by season
* [ ] Competitions linked to seasons
* [ ] Player statistics by competition
* [ ] Automatic season totals
* [ ] Rankings and player comparisons
* [ ] Trophy and award history
* [ ] Key match records
* [ ] National team call-ups
* [ ] Formatted call-up export
* [ ] SQLite backup and restore

## Technology stack

### Frontend

* React
* TypeScript
* React Router DOM
* Sass
* Vite

### Backend

* Python
* FastAPI
* SQLite
* SQLAlchemy or SQLModel
* Alembic

## Project structure

```text
career-vault/
├── frontend/
├── backend/
├── docs/
├── screenshots/
├── .gitignore
├── LICENSE
└── README.md
```

## Getting started

Installation and execution instructions will be added as the initial frontend and backend setup is completed.

## Development status

CareerVault is in its initial planning and development stage.

The first development milestone will focus on:

1. creating and selecting saves;
2. registering clubs and national teams;
3. creating players;
4. detecting possible duplicate players;
5. managing seasons and seasonal squads.

## Data storage

Application data will be stored locally in a SQLite database.

Personal database files, backups, uploaded images and environment variables are excluded from the public repository.

A demonstration database or seed script may be added in a future version.

## License

This project is licensed under the MIT License.
