# Event Management System

This is a backend API for an Event Management System built using **Node.js**, **Express.js**, **MongoDB**, **JWT** (JSON Web Token), and **Bcrypt** for hashing passwords. It allows users to register, login, and manage events.

## Features

- **User Registration**: Users can create an account with their name, email, and password.
- **User Login**: Registered users can log in and receive an access token.
- **Event Management**: Admins can create, read, update, and delete events. Events include name, date, capacity, and available seats.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express.js**: Framework to handle HTTP requests and routing.
- **MongoDB**: NoSQL database to store user and event data.
- **JWT**: Token-based authentication for user sessions.
- **Bcrypt**: Password hashing for secure authentication.
- **CORS**: Allow cross-origin requests for front-end integration.

## Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd <repository-folder>

```

# server.js File Structure

The `server.js` file is the main entry point of the backend application and is structured to handle the authentication and event management logic in a clear sequence. Here's an overview of its flow:

## 1. **Authentication Routes (Login & Registration)**  
   The first part of the file contains the routes for user authentication. It starts with handling user registration, where new users can sign up by providing necessary details like their name, email, and password. If the registration is successful, a new user is added to the database. The login route follows, allowing registered users to log in by entering their credentials. Upon successful login, a token is generated to authorize future requests.

## 2. **Authentication Middleware**  
   After the authentication routes, a middleware is introduced to ensure that all subsequent routes (such as event management) are accessed only by authenticated users. The middleware checks if the user has provided a valid token in their request, and if not, access is denied.

## 3. **Event Management Routes**  
   Once the user is authenticated, the file handles the routes related to event management. This section includes functionality for creating new events, viewing all events, updating event details, and deleting events. These routes allow users to manage events efficiently after they have logged in.

## 4. **Server Initialization**  
   Finally, the file sets up the server to listen for incoming requests on a specific port, enabling the application to interact with clients.

---

## Summary:

1. **User Authentication** comes first, with routes for login and registration.
2. **Authentication Middleware** follows, securing access to protected routes.
3. **Event Management** routes are provided for handling CRUD operations on events.
This structure ensures a clean separation between authentication and the core functionality of the application, keeping the flow secure and organized.
