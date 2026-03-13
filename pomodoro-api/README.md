# Pomodoro Timer — Backend API

REST API built with **.NET 10**, **Entity Framework Core**, and **PostgreSQL** (Supabase). Handles OAuth authentication and persists tasks and pomodoro sessions.

## Tech Stack

| Tool | Purpose |
|------|---------|
| .NET 10 (ASP.NET Core) | Web API framework |
| Entity Framework Core | ORM + migrations |
| Npgsql | PostgreSQL driver |
| JWT Bearer | API authentication |
| Supabase | PostgreSQL hosting (free tier) |
| Fly.io | API hosting (free tier) |

## Getting Started

### Prerequisites

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- PostgreSQL instance (local or [Supabase](https://supabase.com))

### Configure

Edit `src/PomodoroApi/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=pomodoro_dev;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Secret": "your-secret-key-at-least-32-characters-long"
  },
  "OAuth": {
    "GitHub": {
      "ClientId": "your-github-client-id",
      "ClientSecret": "your-github-client-secret"
    }
  },
  "Frontend": {
    "Url": "http://localhost:3000"
  }
}
```

### Run

```bash
cd src/PomodoroApi
dotnet run
```

The API starts at `http://localhost:5000`. Migrations run automatically on startup.

## Project Structure

```
pomodoro-api/
├── src/PomodoroApi/
│   ├── Controllers/
│   │   ├── AuthController.cs        # OAuth flow (GitHub, Google, Facebook)
│   │   ├── TasksController.cs       # CRUD tasks
│   │   └── SessionsController.cs    # Record pomodoro sessions
│   ├── Models/
│   │   ├── User.cs                  # User entity (OAuth provider info)
│   │   ├── TaskItem.cs              # Task entity
│   │   └── PomodoroSession.cs       # Session entity
│   ├── Data/
│   │   ├── AppDbContext.cs          # EF Core context + schema config
│   │   └── Migrations/              # EF Core migrations
│   ├── DTOs/                        # Request/response data transfer objects
│   ├── Services/
│   │   └── TokenService.cs          # JWT generation and validation
│   ├── Program.cs                   # App configuration (DI, auth, CORS)
│   ├── Dockerfile                   # Container build for Fly.io
│   └── appsettings.json             # Configuration template
├── fly.toml                         # Fly.io deployment config
└── PomodoroApi.slnx                 # Solution file
```

## API Endpoints

### Auth

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/{provider}` | Start OAuth flow (github, google, facebook) |
| GET | `/api/auth/{provider}/callback` | OAuth callback — generates JWT, redirects to frontend |
| GET | `/api/auth/me` | Get current user (requires JWT) |

### Tasks (requires JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List user's tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| DELETE | `/api/tasks/completed` | Delete all completed tasks |

### Sessions (requires JWT)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/sessions` | Record a completed pomodoro session |

All protected endpoints require the header: `Authorization: Bearer <JWT token>`

## OAuth Flow

```
Frontend → GET /api/auth/github
         → Redirect to github.com (OAuth consent)
         → GitHub redirects to GET /api/auth/github/callback
         → Backend creates/finds user, generates JWT
         → Redirect to {FRONTEND_URL}/auth/callback?token=JWT
```

## Deployment (Fly.io)

```bash
# 1. Install flyctl
curl -L https://fly.io/install.sh | sh

# 2. Launch app
fly launch

# 3. Set secrets
fly secrets set \
  CONNECTION_STRING="postgresql://..." \
  JWT_SECRET="your-secret" \
  GITHUB_CLIENT_ID="..." \
  GITHUB_CLIENT_SECRET="..." \
  GOOGLE_CLIENT_ID="..." \
  GOOGLE_CLIENT_SECRET="..." \
  FACEBOOK_APP_ID="..." \
  FACEBOOK_APP_SECRET="..." \
  FRONTEND_URL="https://your-frontend.vercel.app"

# 4. Deploy
fly deploy
```

## Database Migrations

```bash
cd src/PomodoroApi

# Add a new migration
dotnet ef migrations add MigrationName --output-dir Data/Migrations

# Apply migrations manually (also runs automatically on startup)
dotnet ef database update
```
