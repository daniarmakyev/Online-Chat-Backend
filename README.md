# Simple Chat Server

This is a small chat server made with Node.js, Express, MongoDB and Socket.IO.

## Main files

- `server.js` - app start and socket setup
- `src/controllers` - route handlers
- `src/services` - business logic
- `src/models` - mongoose models (User, Channel, Message)
- `src/middlewares` - auth for HTTP and socket
- `src/socket` - socket handlers

## Requirements

- Node.j
- MongoDB connection

## Env variables

Create a `.env` file in project root with:

```
DB_URL=<your mongo url>
PORT=3012
JWT_SECRET=<a long secret string>
```

## Install and run

Install deps:

```bash
npm install
```

Start server:

```bash
npm run dev
# or
npm start
```

Server will run on `http://localhost:3012` (if PORT=3012)

## API (basic)

All data is JSON.

- POST `/auth/register`

  - body: { username, email, password }
  - returns: { user, token }

- POST `/auth/login`

  - body: { email, password }
  - returns: { user, token }

- GET `/users/search?q=term` (auth required)

  - search users by username, returns { users }

- POST `/channel/create` (auth required)

  - body: { name }
  - create channel

- GET `/channel/list` (auth required)

  - list channels

- POST `/channel/:channelId/join` (auth required)
- POST `/channel/:channelId/leave` (auth required)
- DELETE `/channel/:channelId` (auth required, owner only)
- DELETE `/channel/:channelId/participants/:participantId` (auth required, owner only)
- GET `/channel/:channelId/messages` (auth required)
- GET `/channel/:channelId/participants` (auth required)

All auth routes need header `Authorization: Bearer <token>`
