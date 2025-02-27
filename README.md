# TestContainers with Next.js and Playwright

This project is a template demonstrating the usage of TestContainers with Next.js and Playwright in a very basic Todo-app. Uses Prisma as ORM and PostgreSQL as database.

## Features

- Next.js development environment with TestContainers
- Playwright tests with TestContainers
- Commands to take snapshots of PostgreSQL-database and being able to reset them

## Getting Started

### Development

First, run the development server:

```bash
yarn dev
```

This will start both the Next.js development server and the PostgreSQL-database in a TestContainer.

Open [http://localhost:3000](http://localhost:3000)

#### Development server commands

- `ctrl + c` to stop the development server
- `ctrl + d` to stop the development server and remove the PostgreSQL-database container
- `ctrl + s` to take a snapshot of the PostgreSQL-database
- `ctrl + r` to reset the PostgreSQL-database to the last snapshot

### Testing

To run the tests, run:

```bash
yarn e2e
```

This will start the PostgreSQL-database in a TestContainer and run the Playwright tests.

## Overview

We have wrapped the `next dev` command for development and testing. This is to ensure that the TestContainers follows the lifecycle of the Next.js development server. In other words, both start and stop at the same time.

This also enables us to add commands to take snapshots of the PostgreSQL-database and reset it to the last snapshot.

Another important reason for wrapping the `next dev` command is to override the environment variables. This is necessary since we want to use a different database for testing than for development.

### Important files

- [`src/`](./src) - Contains the Next.js application, a basic and boring Todo-app.
- [`prisma/`](./prisma) - Contains the Prisma schema and database migrations
- [`testcontainers/psql.ts`](./testcontainers/psql.ts) - A module with functions to start and migrate (with Prisma) the PostgreSQL-database in a TestContainer, as well as taking snapshots and resetting the database.
- [`dev-server.ts`](./dev-server.ts) - Wraps the `next dev` command for development. Also starts and migrates the PostgreSQL-database in a TestContainer. Also contains commands to take snapshots of the database and reset it.
- [`.env.development`](./.env.development) - Environment variables for development
- [`.env.e2e`](./.env.e2e) - Environment variables for testing
- [`tests/e2e-dev-server.ts`](./tests/e2e-dev-server.ts) - Wraps the `next dev` command for testing. Does not start the PostgreSQL-database in a TestContainer, since we want Playwright to handle its lifecycle.
- [`tests/app-fixture.ts`](./tests/app-fixture.ts) - Sets up a test fixture for Playwright to use. Starts and migrates the PostgreSQL-database in a TestContainer. Resets the database after each test.
- [`tests/todos.spec.ts`](./tests/todos.spec.ts) - Playwright tests for the Todo-app
- [`config.ts`](./config.ts) - Loads configuration based on the environment, used by the dev/test servers.

### Talk

Presented at [BartJS Meetup](https://www.meetup.com/bartjs/events/305725338/) on 27th of February 2025.

Slides from the talk available in the [TestContainers-Talk-Slides.pdf](./TestContainers-Talk-Slides.pdf) file.
