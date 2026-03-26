#!/bin/bash

# Production Deployment Script for MOAZZ Portfolio
# This script sets up and deploys the application on your VPS

set -e  # Exit on any error

echo "======================================"
echo "MOAZZ Portfolio - Production Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running on VPS
if [ ! -d "/home/mohazzampriyanto" ]; then
    echo -e "${RED}Error: This script should be run on your VPS${NC}"
    exit 1
fi

# Navigate to app directory
cd ~/moazz-web || { echo -e "${RED}Error: ~/moazz-web directory not found${NC}"; exit 1; }

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"
# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"
echo ""

# Pull latest code
echo -e "${YELLOW}Step 2: Pulling latest code from GitHub...${NC}"
git pull origin main
echo -e "${GREEN}✓ Code updated${NC}"
echo ""

# Check if .env exists
echo -e "${YELLOW}Step 3: Checking environment variables...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create .env file with your credentials."
    echo "You can copy from .env.example:"
    echo "  cp .env.example .env"
    echo "  nano .env  # Edit with your values"
    exit 1
fi
echo -e "${GREEN}✓ .env file exists${NC}"
echo ""

# Setup SSL certificates (first time only)
echo -e "${YELLOW}Step 4: Setting up SSL certificates...${NC}"
if [ ! -d "./certbot/conf/live/moazz.dev" ]; then
    echo "Setting up Let's Encrypt SSL certificates..."
    
    # Create certbot directories
    mkdir -p ./certbot/conf
    mkdir -p ./certbot/www
    
    # Start nginx temporarily for certificate validation
    docker compose -f docker-compose.prod.yml up -d nginx
    
    # Get SSL certificate
    docker compose -f docker-compose.prod.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email your-email@example.com \
        --agree-tos \
        --no-eff-email \
        -d moazz.dev \
        -d www.moazz.dev
    
    echo -e "${GREEN}✓ SSL certificates obtained${NC}"
else
    echo -e "${GREEN}✓ SSL certificates already exist${NC}"
fi
echo ""

# Stop any existing containers
echo -e "${YELLOW}Step 5: Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

# Clean up old images to save space
echo -e "${YELLOW}Step 6: Cleaning up old Docker images...${NC}"
docker image prune -af
echo -e "${GREEN}✓ Cleanup complete${NC}"
echo ""

# Build and start containers
echo -e "${YELLOW}Step 7: Building and starting containers...${NC}"
docker compose -f docker-compose.prod.yml up -d --build

echo -e "${GREEN}✓ Containers started${NC}"
echo ""

# Wait for services to be healthy
echo -e "${YELLOW}Step 8: Waiting for services to be healthy...${NC}"
sleep 10

# Show status
echo ""
echo "======================================"
echo "Deployment Status"
echo "======================================"
docker compose -f docker-compose.prod.yml ps
echo ""

# Show recent logs
echo "======================================"
echo "Recent Logs"
echo "======================================"
docker compose -f docker-compose.prod.yml logs --tail=20
echo ""

# Final message
echo -e "${GREEN}======================================"
echo "Deployment Complete!"
echo "======================================${NC}"
echo ""
echo "Your application should be available at:"
echo "  https://moazz.dev"
echo "  https://www.moazz.dev"
echo ""
echo "Useful commands:"
echo "  View logs:        docker compose -f docker-compose.prod.yml logs -f"
echo "  Check status:     docker compose -f docker-compose.prod.yml ps"
echo "  Restart:          docker compose -f docker-compose.prod.yml restart"
echo "  Stop:             docker compose -f docker-compose.prod.yml down"
echo ""
