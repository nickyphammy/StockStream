# StockStream Docker Setup

This guide will help you run the StockStream application using Docker.

## 🚀 First Time Setup (Start Here!)

**After running `docker-compose up --build`, your application will be available at:**

- **📱 Main Application**: http://localhost:3000
- **🔧 API Backend**: http://localhost:8000
- **📚 API Documentation**: http://localhost:8000/docs

**To verify everything is working:**
```bash
docker-compose ps    # Should show both containers running
curl http://localhost:8000/health    # Should return {"status":"healthy"}
```

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- Finnhub API key (get one free at [finnhub.io](https://finnhub.io))

## Quick Start

1. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and add your Finnhub API key
   nano .env  # or use your preferred editor
   ```

2. **Build and run the application:**
   ```bash
   # Build and start all services
   docker-compose up --build
   
   # Or run in detached mode (background)
   docker-compose up --build -d
   ```

3. **🌐 ACCESS YOUR APPLICATION:**
   
   **Open your web browser and navigate to:**
   - **📱 Frontend Application**: http://localhost:3000
   - **🔧 Backend API**: http://localhost:8000  
   - **📚 API Documentation**: http://localhost:8000/docs

   **✅ How to verify it's working:**
   ```bash
   # Check container status
   docker-compose ps
   
   # Test backend health
   curl http://localhost:8000/health
   ```

## Environment Variables

Create a `.env` file in the StockStream directory with:

```env
FINNHUB_API_KEY=your_actual_api_key_here
```

## Docker Commands

### Development Commands
```bash
# Build and start services
docker-compose up --build

# Start services (after initial build)
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
```

### Production Commands
```bash
# Run in production mode (detached)
docker-compose up -d --build

# Scale services (if needed)
docker-compose up -d --scale backend=2

# Update services
docker-compose pull
docker-compose up -d --build
```

### Maintenance Commands
```bash
# Remove containers and networks
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove containers, networks, volumes, and images
docker-compose down -v --rmi all

# View running containers
docker-compose ps

# Execute commands in running containers
docker-compose exec backend bash
docker-compose exec frontend sh
```

## Architecture

- **Backend**: FastAPI application running on port 8000
- **Frontend**: React application served by nginx on port 80 (mapped to 3000)
- **Network**: Both services communicate through a Docker bridge network

## 🔍 Understanding Port Mappings

Your application uses these port mappings (defined in `docker-compose.yml`):

```yaml
backend:
  ports:
    - "8000:8000"    # localhost:8000 → container port 8000

frontend:
  ports:
    - "3000:80"      # localhost:3000 → container port 80
```

**How to check what's running:**
```bash
# See all containers and their ports
docker-compose ps

# Check specific port mappings
docker port stockstream-frontend
docker port stockstream-backend
```

**Expected output from `docker-compose ps`:**
```
NAME                   PORTS                                                                                        
stockstream-backend    0.0.0.0:8000->8000/tcp
stockstream-frontend   0.0.0.0:3000->80/tcp
```

## Troubleshooting

### Common Issues

1. **Can't access frontend at localhost:3000:**
   ```bash
   # Check if containers are running
   docker-compose ps
   
   # Check if port 3000 is available
   lsof -i :3000
   
   # View frontend logs
   docker-compose logs frontend
   ```

2. **Port conflicts:**
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :8000
   
   # Stop conflicting services or change ports in docker-compose.yml
   ```

2. **API key issues:**
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Verify environment variables
   docker-compose exec backend env | grep FINNHUB
   ```

3. **Build failures:**
   ```bash
   # Clean build (remove cache)
   docker-compose build --no-cache
   
   # Remove all containers and rebuild
   docker-compose down -v
   docker-compose up --build
   ```

4. **Frontend can't reach backend:**
   - Check that both services are running: `docker-compose ps`
   - Verify network connectivity: `docker-compose exec frontend ping backend`

### Health Checks

The backend includes a health check endpoint:
```bash
# Check backend health
curl http://localhost:8000/health

# Or from within Docker
docker-compose exec backend curl http://localhost:8000/health
```

## Development vs Production

### Development Mode
- Uses volume mounts for live code reloading
- Includes development tools and debugging
- Runs with `docker-compose up`

### Production Mode
- Optimized builds with multi-stage Dockerfiles
- Minimal runtime images
- Runs with `docker-compose up -d`

## File Structure

```
StockStream/
├── docker-compose.yml          # Orchestrates both services
├── env.example                 # Environment variables template
├── backend/
│   ├── Dockerfile             # Backend container definition
│   ├── .dockerignore          # Files to exclude from build
│   └── ...                    # Backend source code
└── frontend/
    ├── Dockerfile             # Frontend container definition
    ├── nginx.conf             # Nginx configuration
    ├── .dockerignore          # Files to exclude from build
    └── ...                    # Frontend source code
```
