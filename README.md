# FlowBoard

Multi-tenant project management API built with Node.js, TypeScript, Express, Prisma and PostgreSQL.

**Live API:** https://flowboard-api-d0vn.onrender.com  
**Swagger UI:** https://flowboard-api-d0vn.onrender.com/docs

## Features

- User authentication
- Multi-tenant organization workspace model
- Organization management
- Membership management
- Project management
- Task management
- Task filtering
- Invitations
- Role-based authorization

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **API Documentation:** OpenAPI / Swagger UI
- **Testing:** Vitest and Supertest

## Data Model

### User

- belongs to many organizations through memberships
- can create tasks
- can be assigned tasks
- can receive invitations to organizations

### Organization

- has many memberships
- has many projects
- invitations can be sent to users

### Membership

- links a user to an organization
- stores the user's role within the organization

### Invitation

- invites a user to join an organization
- is sent by a user
- belongs to an organization

### Project

- belongs to an organization
- contains tasks

### Task

- belongs to a project
- is created by a user
- may be assigned to a user

## Authorization Rules

### Organization

- Members can view organizations they belong to.
- Admins can invite users.
- Admins can manage memberships.
- Admins can delete the organization.

### Project

- Admins can create and delete projects.
- Only organization members can access projects.

### Tasks

- Admins and assignees can update title, description and status.
- Admins can update assignee and priority.

### Organization Safeguards

- The last admin of an organization cannot leave the organization.
- The last admin of an organization cannot be demoted.
- A user cannot delete their account if they are the last admin of any organization.

## Architecture

The API is organized into modules:

```text
modules/
  auth/
  invitations/
  memberships/
  organizations/
  projects/
  tasks/
  users/
```

Each module follows a layered architecture:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Prisma
  ↓
PostgreSQL
```

## Design Decisions

- Business logic lives in services to keep controllers focused on HTTP concerns.
- Memberships and invitations use composite keys instead of surrogate IDs because the relationship itself serves as the resource identity.
- Task ordering uses spaced integers to minimize reindexing when tasks are reordered.
- Errors are translated into domain-specific AppErrors to keep HTTP error handling consistent across the application.

## API Endpoints

### Authentication

| Method | Endpoint |
|----------|---------|
| POST | /auth/register |
| POST | /auth/login |

### Organizations

| Method | Endpoint |
|----------|----------|
| POST | /organizations |
| GET | /organizations |
| GET | /organizations/:organizationId |
| DELETE | /organizations/:organizationId |

### Projects

| Method | Endpoint |
|----------|----------|
| POST | /organizations/:organizationId/projects |
| GET | /organizations/:organizationId/projects |
| GET | /projects/:projectId |
| DELETE | /projects/:projectId |

### Tasks

| Method | Endpoint |
|----------|----------|
| POST | /projects/:projectId/tasks |
| GET | /projects/:projectId/tasks |
| GET | /tasks/:taskId |
| PATCH | /tasks/:taskId |
| DELETE | /tasks/:taskId |

### Invitations

| Method | Endpoint |
|----------|----------|
| POST | /organizations/:organizationId/invitations |
| GET | /organizations/:organizationId/invitations |
| DELETE | /organizations/:organizationId/invitations/:userId |
| GET | /invitations |
| POST | /invitations/:organizationId/reject |
| POST | /invitations/:organizationId/accept |

### Memberships

| Method | Endpoint |
|----------|----------|
| GET | /organizations/:organizationId/memberships |
| PATCH | /organizations/:organizationId/memberships/:userId |
| DELETE | /organizations/:organizationId/memberships/:userId |
| DELETE | /organizations/:organizationId/membership |

### Users

| Method | Endpoint |
|----------|----------|
| DELETE | /me |

## Getting Started

### Prerequisites

- Node.js 26.13.1
- Docker and Docker Compose
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/flowboard"
JWT_SECRET=""
API_URL=""
PORT=""
```

### Database

The project uses Docker Compose to run two PostgreSQL instances:
- **Development database:** `flowboard` (port `5433`).
- **Test database:** `flowboard_test` (port `5434`).

Start both databases:

```bash
docker compose up -d
```

Run the database migrations and generate the Prisma client:

```bash
npm run prisma:migrate:dev
```

### Run the Application

```bash
npm run dev
```

The API will be available at `http://localhost:[PORT]`.

## API Documentation

Interactive API documentation is available through Swagger UI:

```text
/docs
```

It describes the available endpoints, request parameters, request bodies, and responses.

## Running Tests

```bash
npm run test:integration
```