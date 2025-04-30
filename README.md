# Liberal Learning Courses (LLC) Portal

A full-stack web application for managing and accessing educational courses, built with React, Express, and MongoDB.

## Project Structure

```
.
├── client/                 # React frontend application
├── server/                 # Express backend server
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── src/                   # Source files
└── LLC_Portal/            # Additional project resources
```

## Tech Stack

### Frontend
- React
- Vite
- TailwindCSS
- React Router DOM
- Heroicons
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt

## Features

- User authentication and authorization
- Course management system
- Admin dashboard
- Secure API endpoints
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:

```bash
# Start the backend server (from server directory)
npm start

# Start the frontend development server (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Documentation

The API documentation can be found in the server/routes directory. Main endpoints include:

- Authentication routes
- User management
- Course management
- Admin operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For any queries or support, please contact the project maintainers.
