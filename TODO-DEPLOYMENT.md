# Quick TODO: Docker to Production Deployment

A simplified checklist for deploying a Dockerized application to VPS with CI/CD.

---

## ✅ Phase 1: Local Docker Setup

### 1. Create Docker Configuration
- [ ] Create `backend/Dockerfile`
  - Multi-stage build (builder + production)
  - Use compatible base image (`node:20-slim` for Prisma)
  - Install dependencies
  - Build application
  - Add health check
- [ ] Create `frontend/Dockerfile`
  - Multi-stage build
  - Configure standalone output
  - Add health check
- [ ] Create `docker-compose.yml`
  - Define services (backend, frontend, nginx)
  - Configure environment variables
  - Set up networking
  - Configure health checks
- [ ] Create `.dockerignore` files
  - Exclude node_modules, .git, logs
- [ ] Create `nginx/nginx.conf`
  - Configure reverse proxy
  - Set up rate limiting
  - Add security headers

### 2. Test Locally
- [ ] Create `.env` file with credentials
- [ ] Run `docker-compose up -d`
- [ ] Verify all containers are healthy
- [ ] Test backend API endpoint
- [ ] Test frontend in browser
- [ ] Check nginx routing

### 3. Fix Common Issues
- [ ] If Prisma fails: Use Debian-based image, not Alpine
- [ ] If npm fails: Use `--omit=dev` not `--only=production`
- [ ] If containers unhealthy: Check logs with `docker-compose logs`
- [ ] If build slow: Use Docker layer caching properly

---

## ✅ Phase 2: Prepare Production Config

### 4. Create Production Files
- [ ] Create `docker-compose.prod.yml`
  - Change ports to `expose` instead of `ports`
  - Update CORS to production domain
  - Add SSL/certbot services
  - Set restart policies to `always`
- [ ] Create `nginx/nginx.prod.conf`
  - Configure HTTPS
  - Add SSL certificate paths
  - Set up HTTP to HTTPS redirect
  - Add Let's Encrypt validation endpoint
- [ ] Create `.github/workflows/deploy.yml`
  - Define deployment trigger (push to main)
  - Add SSH connection step
  - Add deployment commands
  - Add status checks
- [ ] Update `.gitignore`
  - Add certbot directories
  - Add .env files
  - Add SSL certificates

### 5. Commit to GitHub
- [ ] Create GitHub repository (if not exists)
- [ ] Add all Docker files
- [ ] Commit and push to main branch
- [ ] Verify files are on GitHub

---

## ✅ Phase 3: VPS Setup

### 6. Provision VPS
- [ ] Create VPS instance (GCP, AWS, DigitalOcean, etc.)
  - Recommended: 2GB RAM minimum
  - Ubuntu 22.04 LTS recommended
- [ ] Note down:
  - VPS IP address
  - SSH username
  - SSH connection method

### 7. Configure Domain
- [ ] Buy domain (if not have)
- [ ] Add DNS A records:
  - `@` → VPS IP
  - `www` → VPS IP
- [ ] Set TTL to 300 (5 minutes) for faster propagation
- [ ] Verify DNS: `nslookup yourdomain.com`

### 8. Install Docker on VPS
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose plugin
sudo apt-get install docker-compose-plugin -y

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

### 9. Configure VPS Firewall
- [ ] Allow port 22 (SSH)
- [ ] Allow port 80 (HTTP)
- [ ] Allow port 443 (HTTPS)
- [ ] Check cloud provider firewall (GCP, AWS Security Groups, etc.)

### 10. Stop Conflicting Services
```bash
# Stop system nginx if installed
sudo systemctl stop nginx
sudo systemctl disable nginx

# Check nothing on port 80/443
sudo ss -tulpn | grep -E ':80|:443'
```

---

## ✅ Phase 4: GitHub Actions Setup

### 11. Generate SSH Key for CI/CD
```bash
# On VPS
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
# Press Enter for all prompts (no passphrase)

# Add to authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Display private key (copy this)
cat ~/.ssh/github_actions
```

### 12. Configure GitHub Secrets
Go to: `https://github.com/USERNAME/REPO/settings/secrets/actions`

Add these secrets:
- [ ] `VPS_HOST` - Your VPS IP address
- [ ] `VPS_USERNAME` - Your SSH username
- [ ] `VPS_SSH_KEY` - Private key from step 11
- [ ] `DATABASE_URL` - Database connection string
- [ ] `DIRECT_URL` - Direct database URL (if using Prisma)
- [ ] `SUPABASE_URL` - Supabase URL (if using)
- [ ] `SUPABASE_ANON_KEY` - Supabase key (if using)
- [ ] `ADMIN_API_KEY` - Admin API key

---

## ✅ Phase 5: Initial Deployment

### 13. Clone Repository on VPS
```bash
# On VPS
cd ~
git clone https://github.com/USERNAME/REPO.git
cd REPO
```

### 14. Create .env File
```bash
# On VPS
nano .env
# Paste your environment variables
# Save: Ctrl+X, Y, Enter
```

### 15. Get SSL Certificate

**First, start temporary nginx for SSL validation:**
```bash
# Create temporary nginx config (HTTP only)
cat > nginx/nginx.temp.conf << 'EOF'
events {
    worker_connections 1024;
}
http {
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        location / {
            return 200 "Setting up SSL...\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Create certbot directories
mkdir -p certbot/conf certbot/www

# Start temporary nginx
docker run -d \
  --name nginx-temp \
  -p 80:80 \
  -v $(pwd)/nginx/nginx.temp.conf:/etc/nginx/nginx.conf:ro \
  -v $(pwd)/certbot/www:/var/www/certbot:ro \
  nginx:alpine

# Get certificate (REPLACE EMAIL AND DOMAIN!)
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email YOUR_EMAIL@example.com \
  --agree-tos \
  --no-eff-email \
  -d yourdomain.com \
  -d www.yourdomain.com

# Stop temporary nginx
docker stop nginx-temp
docker rm nginx-temp
```

### 16. Deploy Production
```bash
# On VPS
cd ~/REPO

# Start production
docker compose -f docker-compose.prod.yml up -d

# Wait for health checks
sleep 30

# Check status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs
```

---

## ✅ Phase 6: Verify Deployment

### 17. Test Everything
- [ ] Check containers: `docker compose -f docker-compose.prod.yml ps`
  - All should show "healthy"
- [ ] Test HTTP: `curl -I http://yourdomain.com`
  - Should redirect to HTTPS
- [ ] Test HTTPS: `curl -I https://yourdomain.com`
  - Should return 200 OK
- [ ] Test API: `curl https://yourdomain.com/api/v1/endpoint`
- [ ] Open in browser: `https://yourdomain.com`
  - Should load correctly
  - Check for SSL padlock icon
- [ ] Test CI/CD:
  - Make a small change locally
  - Push to GitHub
  - Check GitHub Actions
  - Verify auto-deployment works

### 18. Monitor
```bash
# View logs in real-time
docker compose -f docker-compose.prod.yml logs -f

# Check resource usage
docker stats

# Check disk space
df -h

# Check memory
free -h
```

---

## 🔧 Common Issues & Fixes

### Issue: Container Unhealthy
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs SERVICE_NAME

# Common causes:
# - Missing .env file
# - Wrong environment variables
# - Database connection failed
# - Port already in use
```

### Issue: Connection Refused
```bash
# Check if ports are listening
sudo ss -tulpn | grep -E ':80|:443'

# Check firewall
# - VPS firewall: ufw status
# - Cloud firewall: Check GCP/AWS console

# Check nginx
docker compose -f docker-compose.prod.yml logs nginx
```

### Issue: SSL Certificate Failed
```bash
# Check DNS first
nslookup yourdomain.com

# Check if port 80 is accessible
curl http://yourdomain.com

# Try getting cert manually
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email YOUR_EMAIL \
  -d yourdomain.com \
  --dry-run  # Test first
```

### Issue: Out of Disk Space
```bash
# Clean up old images
docker image prune -af

# Clean up everything
docker system prune -af

# Check space
df -h
```

### Issue: Out of Memory
```bash
# Check memory usage
free -h
docker stats

# Restart containers one by one
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml restart frontend
```

---

## 📝 Quick Reference Commands

### Local Development
```bash
docker-compose up -d              # Start
docker-compose down               # Stop
docker-compose logs -f            # View logs
docker-compose ps                 # Check status
docker-compose restart SERVICE    # Restart service
docker-compose build --no-cache   # Rebuild
```

### Production (VPS)
```bash
cd ~/REPO
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml restart SERVICE
docker image prune -af            # Clean up
```

### Deployment
```bash
# Local machine
git add .
git commit -m "your message"
git push origin main              # Triggers auto-deploy

# Manual deploy on VPS
cd ~/REPO
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ All containers show "healthy" status
- ✅ `https://yourdomain.com` loads in browser
- ✅ SSL certificate shows valid (green padlock)
- ✅ API endpoints return correct responses
- ✅ GitHub Actions shows green checkmark
- ✅ Pushing to main auto-deploys to production
- ✅ No errors in container logs
- ✅ Health check endpoint returns 200

---

## 🔄 Maintenance Tasks

### Daily
- Check `docker compose ps` for unhealthy containers
- Monitor disk space: `df -h`
- Monitor memory: `free -h`

### Weekly
- Review logs for errors
- Check GitHub Actions for failed deployments
- Verify SSL certificate validity

### Monthly
- Update dependencies (npm update)
- Clean up Docker images: `docker image prune -af`
- Review and rotate API keys
- Check for security updates: `sudo apt update`

### Every 3 Months
- Backup database
- Review and update documentation
- Performance testing
- Security audit

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose](https://docs.docker.com/compose)
- [Nginx Configuration](https://nginx.org/en/docs)
- [Let's Encrypt](https://letsencrypt.org/docs)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Total Time Estimate:**
- Local Docker Setup: 2-4 hours
- Production Config: 1-2 hours
- VPS Setup: 1-2 hours
- CI/CD Setup: 1 hour
- Initial Deployment: 1-2 hours
- **Total: 6-11 hours** (first time)

**Next Time:** 30 minutes (now you know how!)

---

*Save this checklist for future projects!*
