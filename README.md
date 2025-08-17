# Full-Stack Demo Project — React + .NET Chatbot

> **⚠️ Disclaimer** > This is a **demo version** of the application. The live environment is for testing purposes only.  
> Please **do not input any sensitive or confidential information**.

---

This repository contains a full-stack chatbot application, featuring a React frontend and a .NET backend. The backend is powered by the Gemini Flash AI model and connects to a PostgreSQL database.

## 📑 Table of Contents

1.  [⭐ Overview & Architecture](#⭐-overview--architecture)
2.  [📚 Tech Stack](#-tech-stack)
    -   [Frontend (React)](#frontend-react)
    -   [Backend (.NET)](#backend-net)
    -   [Database & Deployment](#database--deployment)
3.  [🛠️ Full-Stack Setup Instructions](#️-full-stack-setup-instructions)
    -   [1️⃣ Prerequisites](#1️⃣-prerequisites)
    -   [2️⃣ Clone the Repository](#2️⃣-clone-the-repository)
    -   [3️⃣ Backend Setup](#3️⃣-backend-setup)
    -   [4️⃣ Frontend Setup](#4️⃣-frontend-setup)
4.  [⚙️ CLI Commands Summary](#️-cli-commands-summary)
5.  [📖 API Usage via Swagger](#-api-usage-via-swagger)
6.  [🚦 GitHub Actions Workflow](#-github-actions-workflow)
7.  [📄 License](#-license)

---

## ⭐ Overview & Architecture

This project is a demonstration of a modern full-stack application.

* **Frontend**: A responsive user interface built with **React**, **Vite**, and **TypeScript**, styled with **Tailwind CSS**. It communicates with the backend API to provide a seamless chat experience.
* **Backend**: A robust API built with **.NET 9**, providing secure authentication (**JWT**), chat session management, and AI-powered responses using the **Gemini Flash** model.
* **Database**: Chat history, user data, and sessions are stored persistently in a **PostgreSQL** database, managed with **Entity Framework Core** using a code-first approach.

The overall architecture is as follows:

```

[ User ] \<=\> [ Browser: React Frontend ] \<=\> [ API: .NET Backend ] \<=\> [ Database: PostgreSQL ]

````

---

## 📚 Tech Stack

### Frontend (React)

-   **[React](https://react.dev/)**: JavaScript library for building user interfaces.
-   **[Vite](https://vitejs.dev/)**: Fast build tool and development server.
-   **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed JavaScript for better maintainability.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
-   **[shadcn/ui](https://ui.shadcn.com/)**: Accessible UI components built with Radix UI and Tailwind CSS.
-   **[TanStack Router](https://tanstack.com/router)**: Type-safe routing for React.
-   **[OpenAPI TypeScript](https://github.com/drwpow/openapi-typescript)**: Generates TypeScript types from the backend's Swagger/OpenAPI definition.

### Backend (.NET)

-   **[.NET 9](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9)**: High-performance, cross-platform backend framework.
-   **[Gemini Flash (Free Tier)](https://ai.google.dev/)**: The AI model used for generating chatbot responses.
-   **[Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)**: ORM for database interactions and migrations (code-first).
-   **[JWT Authentication](https://jwt.io/introduction)**: For securing API endpoints.
-   **[Swagger / Swashbuckle](https://swagger.io/tools/swagger-ui/)**: For API documentation and interactive testing.

### Database & Deployment

-   **[PostgreSQL](https://www.postgresql.org/docs/)**: Open-source relational database for data storage.
-   **[Docker](https://docs.docker.com/)**: For containerizing the backend service.
-   **[GitHub Actions](https://docs.github.com/en/actions)**: Automates CI workflows like linting on Pull Requests.

---

## 🛠️ Full-Stack Setup Instructions

Follow these steps to get the entire application running locally. We'll assume a monorepo structure with `/frontend` and `/backend` directories.

### 1️⃣ Prerequisites

Make sure you have the following installed on your system:

-   **[.NET 9 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)**
-   **[Node.js](https://nodejs.org/)** (v18+ recommended)
-   **[PostgreSQL](https://www.postgresql.org/download/)** (v15+)
-   **[Git](https://git-scm.com/)**
-   **[Docker](https://www.docker.com/get-started)** (Optional, for containerized backend)

Verify installations:

```bash
dotnet --version
node -v
npm -v
````

### 2️⃣ Clone the Repository

```bash
git clone git@github.com:markestella/ai-chat-full-stack.git
cd your-fullstack-repo
```

### 3️⃣ Backend Setup

First, let's get the .NET API server running.

1.  **Navigate to the backend directory:**

    ```bash
    cd AI.Backend
    ```

2.  **Configure Environment Variables:**
    Create an `appsettings.json` file in the backend's root directory and populate it with your credentials.

    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Host=localhost;Database=ChatbotDb;Username=postgres;Password=your-postgres-password"
      },
      "JwtSettings": {
        "SecretKey": "your-super-secret-key-that-is-at-least-32-chars-long",
        "Issuer": "ChatbotApi",
        "Audience": "ChatbotApiUsers",
        "ExpiryMinutes": 60
      },
      "GeminiApi": {
        "ApiKey": "your-google-gemini-api-key"
      }
    }
    ```

3.  **Setup Database:**
    Run Entity Framework migrations to create the database schema in PostgreSQL.

    ```bash
    dotnet ef database update
    ```

4.  **Run the Backend Server:**

    ```bash
    dotnet run
    ```

    The API should now be running and accessible at `https://localhost:5262`. Keep this terminal open.

### 4️⃣ Frontend Setup

Now, let's start the React development server. **Open a new terminal window** for these commands.

1.  **Navigate to the frontend directory:**

    ```bash
    # Make sure you are in the project's root directory first
    cd AI.Frontend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Start the Development Server:**

    ```bash
    npm run dev
    ```

    The frontend application should now be running and accessible at `http://localhost:5173`. It will connect to the backend API running on port 5262.

-----

## ⚙️ CLI Commands Summary

| Directory | Command              | Description                               |
| :-------- | :------------------- | :---------------------------------------- |
| `frontend`  | `npm install`        | Install frontend dependencies             |
| `frontend`  | `npm run dev`        | Start frontend development server         |
| `frontend`  | `npm run build`      | Build frontend for production             |
| `frontend`  | `npm run lint`       | Run ESLint checker                        |
| `frontend`  | `npm run lint --fix` | Automatically fix lint issues             |
| `backend`   | `dotnet run`         | Run the backend API server                |
| `backend`   | `dotnet ef database update` | Apply EF migrations to the database |
| `backend`   | `dotnet ef migrations add <Name>` | Create a new database migration |
| `(root)`    | `docker-compose up --build` | (Optional) Run backend with Docker |

-----

## 📖 API Usage via Swagger

You can test the backend API independently using its built-in Swagger UI.

1.  **Access Swagger UI:** With the backend running, navigate to `https://localhost:5262/swagger/index.html`.

2.  **Test Authentication Flow:**

      - Use the `/api/auth/register` endpoint to create a new user.
      - Use the `/api/auth/login` endpoint with your new credentials to get a JWT token.
      - Click the **Authorize** button (top right) and paste the token in the format: `Bearer your-jwt-token`.
      - You can now test the protected endpoints (e.g., creating chats, sending messages).

-----

## 🚦 GitHub Actions Workflow

This project includes a CI workflow using GitHub Actions.

  - **On Pull Request**:
    1.  A workflow is triggered to run `npm run lint` on the `frontend` code.
    2.  If the linter finds any errors, the pull request will be blocked from merging until the issues are fixed.

-----

## 📄 License

This project is for **demonstration purposes only**. It is not licensed for production use and is provided without warranty.
