# ComplexCare CRM Dockerfile
# Production-ready Node.js application

FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Run database migrations and create default superadmin if needed
RUN npm run db:push && npm run deploy

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
