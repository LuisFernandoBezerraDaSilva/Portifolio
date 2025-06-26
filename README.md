# 📁 Portfolio Repository

Welcome to my comprehensive portfolio repository! This contains multiple projects showcasing different technologies and frameworks.

## 🏗️ Project Structure

This repository is organized into multiple independent projects:

```
📦 Portfolio/
├── 🔧 back-end/          # Backend services
│   └── node-project/     # Node.js API with Prisma ORM
├── 🎨 front-end/         # Frontend applications
│   ├── angular-project/  # Angular application
│   └── next-project/     # Next.js application
├── 🐍 python-app/        # Python Windows application (standalone)
└── 📋 logs/              # Application logs
```

## 🚀 Projects Overview

### 🔧 Backend (Node.js + Prisma)
- **Location**: `back-end/node-project/`
- **Tech Stack**: Node.js, Express, Prisma ORM, PostgreSQL
- **Features**: RESTful API, authentication, task management, push notifications
- **Tests**: Integration and unit tests included

### 🎨 Frontend Applications

#### Angular Project
- **Location**: `front-end/angular-project/`
- **Tech Stack**: Angular 18+, Material Design, RxJS, NgRx
- **Features**: Task management UI, authentication, responsive design, state management with NgRx
- **State Management**: Centralized store with NgRx for auth and task management
- **Tests**: Comprehensive unit tests (64 tests passing)

#### Next.js Project
- **Location**: `front-end/next-project/`
- **Tech Stack**: Next.js, TypeScript, Tailwind CSS
- **Features**: Modern React application with SSR capabilities

### 🐍 Python Application (Windows Standalone)
- **Location**: `python-app/`
- **Tech Stack**: Python, Tkinter/PyQt (or other GUI framework)
- **Features**: Desktop application for Windows
- **Note**: Runs independently, not included in Docker Compose
- **Requirements**: Needs `.env` file and Google access keys (not included for security)

## 🛠️ Getting Started

### Prerequisites
- **Docker**: Download from [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Node.js** (if running individually): v18 or higher
- **Git**: For cloning the repository

### 🐳 Quick Start with Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Portfolio
   ```

2. **Run with Docker Compose**:
   ```bash
   docker compose up --build
   ```

3. **Access the applications**:
   - Backend API: `http://localhost:3300`
   - Angular App: `http://localhost:4200`
   - Next.js App: `http://localhost:3000`
   - PostgreSQL Database: `localhost:5432`

### ⚡ Performance Notes

**⏱️ Build Time**: The initial Docker build process can take up to **5 minutes** due to
- Building two front-ends at the same time
- Install all npm dependencies
- Compile TypeScript and build production assets

**🚀 Optimization Tips**:
- **Be patient on first run** - grab a coffee! ☕

## 🧪 Testing

### Angular Tests
```bash
cd front-end/angular-project
npm test                    # Run tests in watch mode
npm run test:ci            # Run tests once (CI mode)
```

### Backend Tests
```bash
cd back-end/node-project
npm test                    # Run all tests
npm run test:integration   # Integration tests only
npm run test:unit         # Unit tests only
```

### Python Application Tests
```bash
cd python-app
python -m pytest          # Run Python tests (if available)
```

## 📱 Features

- **🔐 Authentication**: Secure user login and registration
- **📋 Task Management**: Create, read, update, delete tasks
- **🔔 Push Notifications**: Real-time notifications (Firebase)
- **📱 Responsive Design**: Works on desktop and mobile
- **🧪 Comprehensive Testing**: Unit and integration tests
- **🐳 Containerized**: Easy deployment with Docker
- **🖥️ Desktop Application**: Python-based Windows application

## 🔒 Security Notes

- Firebase service account keys are properly gitignored
- Environment variables are used for sensitive data
- Authentication tokens are handled securely
- Python application requires additional `.env` and Google Cloud credentials not included in repository

## 🌐 Live Demo

**Published version**: [https://sophts.shop](https://sophts.shop)

*Note: For notifications to work when running locally, you'll need the Firebase service account key. This file is not included in the repository for security reasons. The Python application runs independently on Windows systems but also requires `.env` configuration and Google Cloud credentials that are excluded for security purposes.*

## 🏪 State Management (NgRx)

The Angular application implements **NgRx** for comprehensive state management, demonstrating enterprise-level architecture patterns:

### 🏗️ Store Architecture
- **Centralized State**: All application state managed through NgRx store
- **Actions**: Type-safe action creators for auth and task operations
- **Reducers**: Pure functions handling state transitions
- **Effects**: Side effect management for API calls and business logic
- **Selectors**: Optimized state selection with memoization

### 🔄 Implemented Features
- **Authentication State**: User session, login status, token management
- **Task Management**: CRUD operations with entity adapter
- **Loading States**: UI loading indicators for async operations
- **Error Handling**: Centralized error state management
- **DevTools Integration**: Redux DevTools for debugging

### 📈 Benefits
- **Predictable State Updates**: All state changes through dispatched actions
- **Time Travel Debugging**: Full action history and state inspection
- **Testability**: Isolated testing with MockStore
- **Performance**: OnPush change detection compatibility
- **Type Safety**: Full TypeScript integration

*See `NGRX_IMPLEMENTATION.md` for detailed architecture documentation.*

## 📚 Technology Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Node.js, Express, Prisma, PostgreSQL |
| **Frontend** | Angular, Next.js, TypeScript, Material UI, Tailwind CSS |
| **State Management** | NgRx (Store, Effects, Entity, DevTools) |
| **Desktop** | Python, Tkinter/PyQt (Windows) |
| **Testing** | Jest, Jasmine, Karma, Pytest |
| **DevOps** | Docker, Docker Compose |
| **Cloud** | Google Cloud Platform, Firebase (notifications) |


## � Contact

Feel free to reach out if you have any questions about these projects or want to discuss collaboration opportunities!

---

*This portfolio demonstrates proficiency in modern web development technologies including Angular, Next.js, Node.js, Python desktop applications, and cloud deployment with Google Cloud Platform and containerization with Docker.*
