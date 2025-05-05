# ComplexCare CRM

A robust healthcare CRM system delivering a secure and intuitive patient management platform with advanced technological integrations.

## Key Components

- PostgreSQL database for persistent storage
- Secure multi-tier access control system
- Comprehensive patient data management
- AI-enhanced reporting and insights (using Groq API)
- Scalable communication infrastructure with compliance-driven design
- Document management system
- Interactive patient support chatbot
- Advanced analytics dashboard
- NHS Digital integration capabilities

## Technology Stack

- **Frontend**: React, TailwindCSS, Shadcn UI, TanStack Query
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Groq API integration
- **Authentication**: Custom authentication with Passport.js
- **Deployment**: Replit

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Groq API key (for AI features)

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/complexcare-crm.git
cd complexcare-crm
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

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
LOG_LEVEL=info
```

4. Set up the database

```bash
npm run db:push
```

5. Start the development server

```bash
npm run dev
```

## Features

### Multi-Tenant Architecture

The application supports multiple healthcare organizations (tenants) with isolated data and customizable settings. A superadmin dashboard allows for tenant management.

### User Roles

- **Superadmin**: System-wide access, tenant management
- **Admin**: Organization-wide access within a tenant
- **Care Staff**: Access to assigned patients and care plans
- **Patient**: Limited access to their own data and communication

### Patient Management

- Comprehensive patient profiles
- Medical history tracking
- Care plan management
- Appointment scheduling
- Document storage and management

### AI-Enhanced Features

- AI-assisted patient care plans
- Medical notes summarization
- Compliance analytics
- NHS Digital services integration
- Compassionate patient support chatbot

### Analytics Dashboard

- Patient demographics visualization
- KPI tracking and reporting
- Clinical outcomes analysis
- Staff performance metrics
- Financial analytics

## API Documentation

The API is organized into the following main sections:

- **/api/auth** - Authentication endpoints
- **/api/patients** - Patient management
- **/api/staff** - Staff management
- **/api/appointments** - Appointment scheduling
- **/api/careplans** - Care plan management
- **/api/documents** - Document storage and retrieval
- **/api/reports** - Analytics and reporting
- **/api/superadmin** - Tenant and system management

## Deployment

### Local Deployment

For local deployment, follow the installation instructions above.

### Production Deployment

For production deployment, set the appropriate environment variables:

```
NODE_ENV=production
PORT=3000
PUBLIC_URL=https://your-domain.com
```

Ensure you have a production-ready PostgreSQL database and configure the `DATABASE_URL` accordingly.

## Security Considerations

- All sensitive data is encrypted at rest and in transit
- Authentication uses secure session management
- Passwords are hashed using scrypt
- API routes are protected with appropriate authorization
- Cross-origin requests are carefully controlled
- File uploads are validated and sanitized

## Compliance

The system is designed with healthcare compliance requirements in mind:

- Data privacy controls
- Audit logging of all system activities
- Role-based access control
- Regular compliance analysis reporting
- NHS Digital integration capabilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact support@complexcare.dev
