#!/bin/bash

# MOAZZ Portfolio - Docker Deployment Script
# This script deploys your application using Docker Compose

set -e  # Exit on error

echo "🚀 Starting MOAZZ Portfolio Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please create .env file from .env.example"
    echo "Run: cp .env.example .env"
    exit 1
fi

echo -e "${GREEN}✓ .env file found${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Error: Docker is not installed!${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Error: Docker Compose is not installed!${NC}"
    echo "Please install Docker Compose first"
    exit 1
fi

echo -e "${GREEN}✓ Docker Compose is installed${NC}"
echo ""

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose down 2>/dev/null || true
echo ""

# Remove old images (optional - saves space)
read -p "Do you want to remove old Docker images? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🗑️  Removing old images...${NC}"
    docker-compose down --rmi all 2>/dev/null || true
fi
echo ""

# Build images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
echo "This may take a few minutes on first run..."
docker-compose build --no-cache
echo ""

# Start containers
echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker-compose up -d
echo ""

# Wait for containers to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check container status
echo ""
echo -e "${GREEN}📊 Container Status:${NC}"
docker-compose ps
echo ""

# Show logs
echo -e "${YELLOW}📋 Recent logs:${NC}"
docker-compose logs --tail=50
echo ""

# Display access URLs
echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "🌐 Your application is running:"
echo "   Frontend: http://localhost (or http://localhost:3000 without nginx)"
echo "   Backend API: http://localhost/api (or http://localhost:3001 without nginx)"
echo "   API Docs: http://localhost/api/docs"
echo ""
echo "📝 Useful commands:"
echo "   View logs:      docker-compose logs -f"
echo "   Stop app:       docker-compose down"
echo "   Restart app:    docker-compose restart"
echo "   View status:    docker-compose ps"
echo ""
echo -e "${YELLOW}⚠️  Note: For production deployment on VPS:${NC}"
echo "   1. Update CORS_ORIGIN in .env to your domain"
echo "   2. Set up SSL certificates for HTTPS"
echo "   3. Update nginx.conf with your domain"
echo ""
