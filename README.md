
# CMS Project

This is a Content Management System (CMS) built with best practices, including the **Repository Pattern** to manage data access and business logic separation. The system allows admins to manage services, news, and other resources, providing an easy-to-use interface for content publishing and management.

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Setup and Installation](#setup-and-installation)
4. [Folder Structure](#folder-structure)
5. [Testing](#testing)
6. [API Endpoints](#api-endpoints)
7. [Best Practices](#best-practices)
8. [License](#license)

## Features

- **Service Management**: Admins can manage various services (e.g., doctors, newspapers, schools) with options to add, update, and list service details.
- **News Management**: Admins can publish, edit, and list news articles with metadata such as tags, thumbnails, and video embedding.
- **Repository Pattern**: The repository pattern is used to separate the data access logic from the business logic for better maintainability and testability.
- **Dynamic Content Management**: Admins can dynamically add new services and service lists, without modifying the core functionality.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest, Supertest for API testing
- **Data Validation**: Joi, Zod
- **Password Hashing**: bcrypt

## Setup and Installation

### Prerequisites

1. **Node.js** (v14.x or higher)
2. **MongoDB** (Locally or MongoDB Atlas for cloud-based DB)

### Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/yourusername/cms-project.git
    cd cms-project
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following configuration:

    ```bash
    DB_URI=mongodb://localhost:27017/cms-db  # Update with your MongoDB URI
    JWT_SECRET=your_secret_key
    ```

4. Start the application:

    ```bash
    npm start
    ```

    The server will run on `http://localhost:3000`.

## Folder Structure

```
/cms-project
│
├── /controllers        # Contains controller logic for API endpoints
│
├── /models             # Contains database schema/models (Prisma/Mongoose)
│
├── /repositories       # Repository pattern: encapsulates all data access logic
│
├── /services           # Contains business logic for each functionality (e.g., services, news)
│
├── /utils              # Utility functions (e.g., password hashing)
│
├── /tests              # Contains unit, integration, and functional tests
│
├── /routes             # Defines API routes
│
├── .env                # Environment variables (DB_URI, JWT_SECRET)
├── server.js           # Entry point to start the application
└── README.md           # This file
```

## Testing

The project includes **unit tests**, **integration tests**, and **functional tests** to ensure that the application behaves as expected.

### Running Unit and Integration Tests

1. To run all tests, execute the following command:

    ```bash
    npm test
    ```

2. If you'd like to run a specific test file, use:

    ```bash
    npm test path/to/test/file
    ```

### Testing Libraries

- **Jest**: Used for running tests and assertions.
- **Supertest**: Used for API integration testing.
- **Sinon**: For stubbing or mocking dependencies during testing.

## API Endpoints

### 1. Service Endpoints

- **POST** `/api/services` - Create a new service
- **GET** `/api/services` - List all services
- **PUT** `/api/services/:id` - Update a service by ID
- **DELETE** `/api/services/:id` - Delete a service by ID

### 2. News Endpoints

- **POST** `/api/news` - Create a new news article
- **GET** `/api/news` - List all news articles
- **GET** `/api/news/:id` - Get a specific news article by ID
- **PUT** `/api/news/:id` - Update a news article by ID
- **DELETE** `/api/news/:id` - Delete a news article by ID

### 3. Authentication Endpoints

- **POST** `/api/auth/login` - Login with email and password
- **POST** `/api/auth/register` - Register a new admin

## Best Practices

### 1. **Repository Pattern**

The repository pattern has been implemented to ensure separation of concerns between the application’s business logic and the data access layer. Each repository contains methods for interacting with the database, while the service layer contains the business logic for manipulating and returning data.

#### Example:

- **Repository** (`ServiceRepository.js`)

```javascript
class ServiceRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async createService(data) {
    return await this.prisma.service.create({
      data,
    });
  }

  async getAllServices() {
    return await this.prisma.service.findMany();
  }

  async getServiceById(id) {
    return await this.prisma.service.findUnique({
      where: { id },
    });
  }
}

module.exports = ServiceRepository;
```

- **Service** (`ServiceService.js`)

```javascript
class ServiceService {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async createService(data) {
    return await this.serviceRepository.createService(data);
  }

  async getAllServices() {
    return await this.serviceRepository.getAllServices();
  }

  async getServiceById(id) {
    return await this.serviceRepository.getServiceById(id);
  }
}

module.exports = ServiceService;
```

### 2. **Error Handling and Logging**

Error handling is centralized in a custom middleware that catches all errors and returns consistent error messages to the client. Logging is done using the `winston` package, with separate log levels for different types of messages.

### 3. **Security Best Practices**

- Passwords are hashed using **bcrypt** before storing them in the database.
- Authentication is handled using **JWT** (JSON Web Tokens).
- **CORS** is configured to allow only trusted origins to access the API.

### 4. **Database Transactions**

For complex operations (e.g., creating or updating multiple records), transactions are used to ensure that changes are only committed if all steps are successful.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
