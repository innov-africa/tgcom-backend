# NestJS Firebase Auth

This is a simple NestJS app with Firebase Auth. It uses Firebase Admin SDK to create a new user and it uses Firebase Auth to sign in with email and password. The user is added in a Firebase Firestore database.

## Prerequisites

- Node.js LTS
- npm
- Firebase project

## Setup

1. Copy `.env.copy` to `.env` and set the values
2. Install dependencies

```bash
npm install
```

### Run in dev mode

```bash
npm run start:dev
```

### Run in prod mode

```bash
npm run start:prod
```

#