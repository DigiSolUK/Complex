# ComplexCare CRM Local Deployment Guide

This document provides instructions for running the ComplexCare CRM application in a local environment for development or testing purposes.

## Prerequisites

1. Node.js 18 or later
2. PostgreSQL 13 or later
3. Git
4. Groq API key for AI features

## Option 1: Manual Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/complexcare-crm.git
cd complexcare-crm
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# AI Service API Keys
GROQ_API_KEY=your-groq-api-key

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/complexcare

# Security
SESSION_SECRET=your-session-secret

# Application Configuration
NODE_ENV=development
PORT=3000

# File storage configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760 # 10MB

# Logging
LOG_LEVEL=debug
```

Replace the placeholder values with your actual configuration details.

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Create Database Tables

```bash
npm run db:push
```

### Step 5: Create Default Admin User

```bash
node scripts/deploy.js
```

### Step 6: (Optional) Seed Demo Data

```bash
node scripts/seed-demo-data.js
```

### Step 7: Start the Application

```bash
npm run dev
```

The application should now be running at http://localhost:3000

## Option 2: Docker Setup (Recommended)

Docker provides an easier way to set up all dependencies and run the application in a consistent environment.

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/complexcare-crm.git
cd complexcare-crm
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory with your Groq API key:

```
GROQ_API_KEY=your-groq-api-key
```

### Step 3: Start Docker Containers

```bash
docker-compose up
```

The application should now be running at http://localhost:3000

## Login Credentials

After running the deployment script or seeding demo data, you can log in with these default credentials:

- **Superadmin**: username `admin`, password `admin123`
- **Admin**: username `drjohnson`, password `demo123`
- **Care Staff**: username `nurse`, password `demo123`
- **Patient**: username `patient`, password `demo123`

**Important:** Change these passwords immediately after first login in a production environment.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, check:

1. Is PostgreSQL running?
2. Are the database credentials correct in your `.env` file?
3. Does the database exist? If not, create it with `createdb complexcare`

### Port Conflicts

If port 3000 is already in use, you can change the port in the `.env` file:

```
PORT=3001
```

### AI Features Not Working

If AI features aren't working, check:

1. Is your Groq API key correct in the `.env` file?
2. Do you have an active Groq account with available credits?

## Security Notes

- This guide is for local development only. Additional security measures are required for production deployment.
- Never commit the `.env` file to version control.
- Change all default passwords.
- Restrict access to the PostgreSQL database.
