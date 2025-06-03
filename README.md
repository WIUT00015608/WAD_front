# Angular Frontend for Coursework (Student ID: 00015608)

## Project Overview
This is the frontend of a coursework (CW) project developed by the student with ID **00015608**. The application is built using **Angular CLI 19.2.10** and serves as the user interface for [insert brief description of the project's purpose, e.g., a student management system, coursework submission portal, etc.]. The frontend communicates with a backend API that connects to a SQL Server database for data storage and management. This project demonstrates the student's ability to design and implement a modern web application with Angular.

## Features
- **Angular 19**: Leverages the latest Angular framework for a responsive and scalable frontend.
- **Angular CLI 19.2.10**: Provides tools for scaffolding, building, and testing the application.

## Prerequisites
To run this project locally, ensure you have the following installed:
- **Node.js**: Version 20.x or later
- **Angular CLI**: Version 19.2.10. Install globally using:
  ```bash
  npm install -g @angular/cli@19.2.10
  ```
- **Backend API**: Ensure the backend API (ASP.NET Core) is set up and running to connect to the SQL Server database.
- **Git**: For cloning and managing the repository.
- **Code Editor**: Visual Studio Code (recommended) or any editor supporting Angular development.

## Project Structure
```
/CW-Frontend-00015608
├── /src
│   ├── /app              # Core application code (components, services, modules)
│   │   ├── /components   # Reusable Angular components
│   │   ├── /services     # Services for API calls and business logic
│   │   ├── /models       # TypeScript interfaces for data models
│   ├── /assets           # Static files (images, fonts, etc.)
│   ├── /environments     # Environment-specific configurations
├── /scripts              # SQL scripts for database setup (if applicable)
├── angular.json          # Angular CLI configuration
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Setup Instructions
Follow these steps to set up and run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/WIUT00015608/WAD_front.git
cd WAD_front
```

### 2. Install Dependencies
Install the required Node.js packages:
```bash
npm install
```

### 3. Configure the Backend API
- Ensure the backend API (provided separately or as part of the coursework) is running and accessible (e.g., at `http://localhost:5166`).
- Update the API URL in the Angular environment file (`src/environments/environment.ts`):
  ```typescript
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:5166/api'
  };
  ```

### 4. Run the Angular Application
Start the Angular development server:
```bash
ng serve
```
The application will be accessible at `http://localhost:4200` (default port).

### 6. Access the Application
- Open a browser and navigate to `http://localhost:4200`.