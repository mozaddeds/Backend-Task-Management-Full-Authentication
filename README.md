# Task Management API (NestJS + PostgreSQL)

![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

A RESTful API with JWT authentication, role-based access control, and full CRUD operations for tasks and projects.

## 📦 Features

- **Authentication**  
  ✅ JWT with access/refresh tokens  
  ✅ Google OAuth 2.0  
  ✅ Role-based guards (`ADMIN`, `EDITOR`, `USER`)  

- **Tasks**  
  🔍 Search with query filters  
  🛠️ CRUD operations with validation  
  🔗 Relation to projects and users  

- **Infrastructure**  
  🐳 Dockerized PostgreSQL  
  📜 Swagger documentation  
  ⚡ Rate limiting (TODO)  

## 🚀 Architecture

```mermaid
graph TD
  A[Client] --> B[API Gateway]
  B --> C[Auth Module]
  B --> D[Tasks Module]
  B --> E[Users Module]
  C --> F[JWT Strategy]
  C --> G[Local Strategy]
  C --> H[Google Strategy]
  D --> I[Prisma ORM]
  E --> I
  I --> J[(PostgreSQL)]
```

### Key Decisions
- Modular Design: Separated auth, tasks, and users for maintainability

- Prisma ORM: Type-safe database access with auto-generated migrations

- Stateless JWT: Enables horizontal scaling

- Docker Compose: Simplified development/production parity

## 🛠️ Setup
### Prerequisites
- Node.js v18+
- Docker & Docker Compose
- PostgreSQL 14+

### Installation
Clone the repo:

```
git clone https://github.com/yourusername/task-management-api.git
cd task-management-api
```

### Configure environment variables:

```
cp .env.example .env
# Fill in your Google OAuth/JWT secrets
```

### Start services:

```
docker-compose up -d --build
```
### Run migrations:

```
docker-compose exec app npx prisma migrate dev
```

### Access APIs:

- API: http://localhost:8000

- Swagger Docs: http://localhost:8000/api

- Prisma Studio: http://localhost:5555

### 📚 Usage

## 📚 Usage

### 🔐 Authentication

| Endpoint            | Method | Description                          |
|---------------------|--------|--------------------------------------|
| `/auth/signup`      | POST   | Register new user                    |
| `/auth/signin`      | POST   | Login with email/password            |
| `/auth/refresh`     | POST   | Refresh access token                 |
| `/auth/google`      | GET    | Initiate Google OAuth flow           |

### 📝 Example Requests

#### User Registration
```
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123!"
}
```
