# 🐳 Backend Docker Deployment Guide

## Prerequisites
- Docker Desktop installed and running
- MongoDB Atlas account (or local MongoDB)
- Node.js 20+ (for local development)

## 📦 Files Already Configured
- ✅ `Dockerfile` - Production-ready Node.js configuration
- ✅ `.dockerignore` - Excludes unnecessary files
- ✅ `.env.example` - Sample environment variables

## 🚀 Build & Run Docker Container

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and update with your actual values:
```bash
cp .env.example .env
```

Update `.env` with:
- Your MongoDB connection string
- Strong JWT secret
- Production frontend URL

### 2. Build the Docker Image
```bash
docker build -t pgb-quarry-backend .
```

### 3. Run the Container
```bash
docker run -d -p 5000:5000 --name quarry-backend --env-file .env pgb-quarry-backend
```

**Note**: If port 5000 is in use, use a different port:
```bash
docker run -d -p 5001:5000 --name quarry-backend --env-file .env pgb-quarry-backend
```

### 4. View Container Logs
```bash
docker logs quarry-backend
```

You should see:
```
🚀 Server running on port 5000
📡 Environment: production
✅ MongoDB Connected
```

### 5. Test the API
```bash
curl http://localhost:5000/api/users
```

### 6. Stop the Container
```bash
docker stop quarry-backend
```

### 7. Remove the Container
```bash
docker rm quarry-backend
```

## 🌐 Deploy to Render

### 1. Push to GitHub
Make sure your code is on GitHub with:
- ✅ `Dockerfile`
- ✅ `.dockerignore`
- ✅ `.env.example` (NOT `.env`)

### 2. Create Web Service on Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: pgb-quarry-backend
   - **Environment**: Docker
   - **Region**: Choose closest to you
   - **Instance Type**: Free or Starter

### 3. Add Environment Variables
In Render Dashboard → Environment:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.vercel.app
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 4. Deploy
Render will automatically:
- Build your Docker image
- Deploy the container
- Provide a public URL

## 🔧 Docker Commands Cheat Sheet

```bash
# Build image
docker build -t pgb-quarry-backend .

# Run container with .env file
docker run -d -p 5000:5000 --name quarry-backend --env-file .env pgb-quarry-backend

# Run container with manual env vars
docker run -d -p 5000:5000 \
  -e MONGODB_URI="your_connection_string" \
  -e JWT_SECRET="your_secret" \
  --name quarry-backend pgb-quarry-backend

# View running containers
docker ps

# View all containers
docker ps -a

# Stop container
docker stop quarry-backend

# Start container
docker start quarry-backend

# Remove container
docker rm quarry-backend

# Remove image
docker rmi pgb-quarry-backend

# View logs
docker logs quarry-backend

# Follow logs
docker logs -f quarry-backend

# Execute command in container
docker exec -it quarry-backend sh

# View container stats
docker stats quarry-backend
```

## 📊 Docker Image Details

### Configuration
- **Base Image**: Node.js 20 Alpine (~50MB)
- **Working Directory**: `/app`
- **Port**: 5000
- **Environment**: Production
- **Dependencies**: Production only (no devDependencies)

### Features
✅ Lightweight Alpine Linux
✅ Production dependencies only
✅ Automatic uploads directory creation
✅ Environment variable support
✅ Health check ready

## 🧪 Testing Docker Build

### Local Test
```bash
# Build
docker build -t pgb-quarry-backend .

# Run
docker run -d -p 5001:5000 --name test-backend --env-file .env pgb-quarry-backend

# Test API
curl http://localhost:5001/api/users

# Check logs
docker logs test-backend

# Cleanup
docker stop test-backend && docker rm test-backend
```

## 🔍 Troubleshooting

### Port Already in Use
```
Error: port is already allocated
```
**Solution**: Use different port or stop existing service
```bash
docker run -d -p 5001:5000 --name quarry-backend --env-file .env pgb-quarry-backend
```

### MongoDB Connection Failed
```
❌ MongoDB Connection Error
```
**Solution**: 
1. Check MongoDB URI in `.env`
2. Ensure IP whitelist includes 0.0.0.0/0 (for cloud deployment)
3. Verify username/password

### Container Exits Immediately
```bash
# Check logs
docker logs quarry-backend

# Common issues:
# - Missing .env file
# - Invalid MongoDB URI
# - Port conflict
```

### Build Fails
```bash
# Clean build
docker system prune -a
docker build --no-cache -t pgb-quarry-backend .
```

## 📝 Production Checklist

Before deploying:
- [ ] Update `.env` with production values
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Configure MongoDB IP whitelist
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL to production URL
- [ ] Test Docker build locally
- [ ] Verify all API endpoints work
- [ ] Test WebSocket connections
- [ ] Check file upload functionality

## 🎯 Current Status

✅ **Docker Image Built**: `pgb-quarry-backend`
✅ **Container Running**: `quarry-backend`
✅ **Port**: 5001 → 5000
✅ **MongoDB**: Connected
✅ **Status**: Running

### Access Your API:
- **Local**: `http://localhost:5001`
- **Health**: Check logs with `docker logs quarry-backend`

## 🚀 Next Steps

1. **Test locally**: Verify all endpoints work
2. **Push to GitHub**: Commit Dockerfile and .dockerignore
3. **Deploy to Render**: Follow deployment steps above
4. **Update Frontend**: Point to production backend URL

Good luck with your deployment! 🎉
