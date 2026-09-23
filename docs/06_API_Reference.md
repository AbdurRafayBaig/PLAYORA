# Ludo Tournament Portal — API Reference

## Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Teams
- `GET /api/tournaments/:id/teams`
- `POST /api/tournaments/:id/teams/import`
- `GET /api/me/team`
- `PATCH /api/me/team`
- `GET /api/me/team/matches`

## Tournament
- `POST /api/tournaments`
- `GET /api/tournaments/:id`
- `PATCH /api/tournaments/:id`
- `POST /api/tournaments/:id/generate-fixtures`

## Matches
- `GET /api/tournaments/:id/matches`
- `POST /api/matches/:id/start`
- `POST /api/matches/:id/pause`
- `POST /api/matches/:id/resume`
- `POST /api/matches/:id/result`
- `POST /api/matches/:id/cancel`
- `POST /api/admin/matches/:id/override`

## Standings
- `GET /api/tournaments/:id/standings`

## Admin
- `GET /api/admin/audit`
- `GET /api/admin/disputes`
- `POST /api/admin/advancements`

All mutation endpoints require authenticated role checks and request validation.
