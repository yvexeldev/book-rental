# Book Rental API Documentation

## Project Overview

This Book Rental API provides a comprehensive backend service for managing book rentals, including user authentication, book management, and rental operations.

## 📋 Environment Configuration

### Environment Variables Overview

#### Main Environment File (`.env`)

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `DATABASE_USER` | PostgreSQL database username | `postgres` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:5432r@localhost:5432/bookrental?schema=public` |
| `DATABASE_PASSWORD` | PostgreSQL database password | `5432r` |
| `DATABASE_NAME` | Database name | `bookrental` |
| `DATABASE_PORT` | Database connection port | `5432` |
| `REDIS_PORT` | Redis server port | `6379` |
| `RABBITMQ_DEFAULT_USER` | RabbitMQ default username | `guest` |
| `RABBITMQ_DEFAULT_PASS` | RabbitMQ default password | `guest` |
| `RABBITMQ_PORT` | RabbitMQ message broker port | `5672` |
| `RABBITMQ_MANAGEMENT_PORT` | RabbitMQ management UI port | `15672` |
| `APP_PORT` | Application listening port | `4000` |
| `JWT_SECRET` | Secret key for JWT token generation | `secret` |
| `I18N_FALLBACK_LANGUAGE` | Fallback language for internationalization | `"en"` |
| `HOST` | Application host | `localhost` |
| `SMTP_USER` | SMTP email for sending notifications | `abdusalomovdev@gmail.com` |
| `SMTP_PASSWORD` | SMTP email password | `fsvs xaii eqso kuvp` |
| `REDIS_HOST` | Redis server hostname | `localhost` |
| `RABBITMQ_URI` | RabbitMQ connection URI | `amqp://guest:guest@127.0.0.1:5672/` |

### Environment Variations

#### Development vs Production
- `.env`: Local development configuration
- `.env.development`: Development-specific settings
- `.env.production`: Production deployment settings

## 🐳 Docker Compose Configuration

### Services Overview

1. **Application Service (`app`)**
   - Builds application from Dockerfile
   - Depends on PostgreSQL, Redis, and RabbitMQ
   - Mounts project directory
   - Uses production environment file

2. **Redis Service (`redis`)**
   - Uses Redis 7 image
   - Persistent volume for data storage
   - Exposes Redis port

3. **RabbitMQ Service (`rabbitmq`)**
   - Uses RabbitMQ 3 management image
   - Exposes message broker and management ports
   - Persistent volume for data storage

4. **PostgreSQL Service (`postgres`)**
   - Uses PostgreSQL 15 image
   - Configures database user, password, and name
   - Persistent volume for database storage

### Docker Compose Volumes
- `postgres-data`: PostgreSQL data persistence
- `redis-data`: Redis data persistence
- `rabbitmq-data`: RabbitMQ data persistence

## 🚢 Dockerfile Breakdown

### Build Stage
- Base Image: `node:20-alpine`
- Steps:
  1. Set working directory to `/app`
  2. Copy `package.json` and `package-lock.json`
  3. Install dependencies with `npm ci`
  4. Copy entire project
  5. Generate Prisma client
  6. Build application

### Production Stage
- Base Image: `node:20-alpine`
- Steps:
  1. Install only production dependencies
  2. Copy built assets from builder stage
  3. Copy Prisma client and schema
  4. Expose port `3000`
  5. Set `NODE_ENV` to production
  6. Run database migrations
  7. Start production server

## 🛠 Setup and Deployment

### Local Development
1. Clone repository
2. Copy `.env.example` to `.env`
3. Modify environment variables
4. Run `npm install`
5. Start services with `npm run start:dev`

### Docker Deployment
```bash
# Build and start services
docker-compose up --build

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build app
```

## 🔒 Security Considerations
- Use strong, unique passwords
- Keep `.env` files out of version control
- Use environment-specific configurations
- Rotate JWT secrets and SMTP credentials

## 📦 Recommended Tooling
- Docker Desktop
- VSCode with Docker extension
- Postman for API testing
- pgAdmin for database management

## 🚨 Troubleshooting
- Ensure all services are running
- Check port availability
- Verify environment variable consistency
- Review Docker logs for specific service issues

## Features

- User Management
  - User registration and verification
  - User authentication (sign up, sign in)
  - User profile management
- Book Management
  - Add, edit, and delete books
  - Search and list books
  - ISBN-based book retrieval
- Rental Management
  - Create, update, and delete book rentals
  - List and retrieve rental information

## API Endpoints

### User Endpoints

#### User Registration

- **POST** `/user/signup`
  - Register a new user
  - Required fields: email, firstName, lastName, password
  - Language parameter: `lang` (default: uz)

#### OTP Verification

- **POST** `/user/verifyOtp`
  - Verify user registration with OTP
  - Required fields: otp, email

#### User Authentication

- **POST** `/user/signin`
  - User login
  - Required fields: email, password

#### User Profile Management

- **GET** `/user/{userId}`
  - Retrieve user information by ID
- **PUT** `/user/{userId}`
  - Update user profile
  - Supports updating firstName, password, etc.
- **PUT** `/user/username/{userId}`
  - Set or update username

#### User Administration

- **GET** `/user/users`
  - List all verified users
- **DELETE** `/user/unverified`
  - Delete unverified user accounts

### Book Endpoints

#### Book Listing

- **GET** `/book`
  - List all books
  - Optional query parameters:
    - `page`: Page number
    - `limit`: Number of books per page
    - `search`: Search books by keyword

#### Book Management

- **GET** `/book/{bookId}`
  - Retrieve book details by ID
- **GET** `/book/isbn/{isbn}`
  - Retrieve book by ISBN
- **POST** `/book`
  - Create a new book
- **PUT** `/book/{bookId}`
  - Update book details
- **DELETE** `/book/{bookId}`
  - Delete a book

### Rental Endpoints

#### Rental Management

- **POST** `/rental`
  - Create a new book rental
  - Required fields: userId, bookId, givenDate
- **GET** `/rental`
  - List all rentals
  - Optional query parameters:
    - `page`: Page number
    - `limit`: Number of rentals per page
- **GET** `/rental/{rentalId}`
  - Retrieve rental details
- **PUT** `/rental/{rentalId}`
  - Update rental information
- **DELETE** `/rental/{rentalId}`
  - Delete a rental

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most endpoints require authentication, with the following auth types:

- Bearer Token
- No authentication for signup and login

## Localization

All endpoints support a language parameter `lang` (default: uz) to provide localized responses.

## Error Handling

The API returns appropriate HTTP status codes and error messages for various scenarios like:

- Invalid credentials
- Resource not found
- Validation errors

## Example Request

### Create a Book Rental

```json
{
  "userId": 1,
  "bookId": 2,
  "givenDate": "2024-11-26"
}
```

## Setup and Installation

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Run database migrations
5. Start the server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

