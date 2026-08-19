# Dev Confessions

An anonymous confession API for developers to share their bugs, deadline stress, imposter syndrome, and vibe-coding sessions.

## Architecture

The API follows a small MVC-style structure. `routes/` maps HTTP endpoints and delegates immediately. `controllers/` handles request and response concerns. `services/` contains validation, in-memory storage, filtering, and deletion logic. `config/env.js` centralizes environment configuration, while `app.js` remains a small Express bootstrap.

| Directory or file | Responsibility |
|---|---|
| `routes/confessionRoutes.js` | HTTP route definitions and controller delegation |
| `controllers/confessionController.js` | Request parsing, service orchestration, and responses |
| `services/confessionService.js` | Confession validation and business logic |
| `config/env.js` | Environment loading and safe configuration defaults |
| `AUDIT.md` | Pre-refactor findings and acceptance criteria |
| `CHANGES.md` | Variable rename and function split decision log |
| `test/confessions.test.js` | Endpoint regression coverage |

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/confessions` | Return all confessions, newest first |
| `POST` | `/api/v1/confessions` | Create a confession |
| `GET` | `/api/v1/confessions/:id` | Return one confession |
| `GET` | `/api/v1/confessions/category/:cat` | Return confessions in a valid category |
| `DELETE` | `/api/v1/confessions/:id` | Delete a confession with the configured token |

## Configuration

Copy `.env.example` to `.env` and set private local values as needed:

```bash
cp .env.example .env
```

`PORT` defaults to `3000`. `DELETE_TOKEN` defaults to the starter token for backward compatibility, but a deployment should always set its own secret value.

## Run and verify

Install dependencies and start the API with:

```bash
npm install
npm start
```

Run the regression suite with:

```bash
npm test
```

## Live Deployment

Deployment URL: https://4317-ipm85xhje9gwvi5n0fsj7-3ccb2d70.sg1.manus.computer. This is a temporary public verification deployment of the refactored API; a persistent Render or Railway deployment requires an external hosting account.

## Refactor documentation

See [AUDIT.md](./AUDIT.md) for the complete pre-refactor audit and [CHANGES.md](./CHANGES.md) for the variable rename and function split log.
