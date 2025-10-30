# PGB-QUARRY-BACKEND

QuarryWebSystem Backend - Provincial Government of Bataan

A robust Node.js/Express backend API with MongoDB, JWT authentication, Socket.IO, and file upload capabilities.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Real-time Communication**: Socket.IO for WebSocket connections
- **File Upload**: Multer integration for handling file uploads
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, bcrypt password hashing
- **Docker Support**: Full Docker and Docker Compose configuration
- **API Documentation**: RESTful API endpoints

## 📋 Prerequisites

- Node.js 18+ or Docker
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

### Local Development

1. **Clone and navigate to the project**
   ```bash
   cd QuarryWebSystem-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

### Docker Deployment

1. **Using Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```
   This will start both the backend API and MongoDB

2. **Using Docker only**
   ```bash
   docker build -t quarry-backend .
   docker run -p 5000:5000 --env-file .env quarry-backend
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Protected)
- `PUT /api/users/:id` - Update user (Protected)
- `DELETE /api/users/:id` - Delete user (Admin only)

### File Upload
- `POST /api/upload/single` - Upload single file (Protected)
- `POST /api/upload/multiple` - Upload multiple files (Protected)

### Health Check
- `GET /health` - Server health status

## 🔐 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/quarrywebsystem
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
```

## 🐳 Docker Commands

```bash
# Build image
docker build -t quarry-backend .

# Run container
docker run -p 5000:5000 quarry-backend

# Start with docker-compose
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild and restart
docker-compose up -d --build
```

## 🚢 Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env.example`
6. Deploy!

### Deploy with Docker on Render

1. Create a new Web Service
2. Select "Docker" as environment
3. Render will automatically detect the Dockerfile
4. Add environment variables
5. Deploy!

## 📁 Project Structure

```
QuarryWebSystem-Backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js   # Auth logic
│   │   ├── user.controller.js   # User CRUD
│   │   └── upload.controller.js # File upload
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Error handling
│   │   └── upload.js            # Multer config
│   ├── models/
│   │   └── User.model.js        # User schema
│   ├── routes/
│   │   ├── auth.routes.js       # Auth routes
│   │   ├── user.routes.js       # User routes
│   │   └── upload.routes.js     # Upload routes
│   └── server.js                # App entry point
├── uploads/                     # Uploaded files
├── .env.example                 # Environment template
├── .gitignore
├── Dockerfile                   # Docker configuration
├── docker-compose.yml           # Docker Compose config
├── package.json
└── README.md
```

## 🔌 Socket.IO Events

- `connection` - Client connected
- `disconnect` - Client disconnected
- `join-room` - Join a room
- `leave-room` - Leave a room
- `message` - Send/receive messages

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📝 License

ISC

## 👨‍💻 Author

QuarryWebSystem Team
