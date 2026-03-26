# Production Deployment Guide

This guide walks you through deploying your MOAZZ portfolio to production with automatic CI/CD.

## Prerequisites Completed ✓

- [x] Domain configured (moazz.dev → VPS IP)
- [x] VPS ready (Ubuntu 22.04, Docker installed)
- [x] GitHub repository (public)
- [x] Docker tested locally

---

## Deployment Steps

### 1. Generate SSH Key for GitHub Actions

On your **VPS**, run:

```bash
# Generate SSH key (press Enter for all prompts)
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# Add key to authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Display private key (you'll need this for GitHub)
cat ~/.ssh/github_actions
```

**Copy the entire private key output** (from `-----BEGIN` to `-----END`). You'll add this to GitHub secrets.

---

### 2. Set Up GitHub Secrets

Go to: `https://github.com/mazzampr/moazz-web/settings/secrets/actions`

Click **"New repository secret"** and add these secrets:

| Secret Name | Value | Where to Get |
|------------|-------|--------------|
| `VPS_HOST` | Your VPS IP address | GCP Console → VM instances |
| `VPS_USERNAME` | `mohazzampriyanto` | Your SSH username |
| `VPS_SSH_KEY` | Private key from step 1 | Output of `cat ~/.ssh/github_actions` |
| `DATABASE_URL` | Your Supabase connection string | From your `.env` file |
| `DIRECT_URL` | Your Supabase direct URL | From your `.env` file |
| `SUPABASE_URL` | Your Supabase project URL | From your `.env` file |
| `SUPABASE_ANON_KEY` | Your Supabase anon key | From your `.env` file |
| `ADMIN_API_KEY` | Your admin API key | From your `.env` file or generate new one |

**Security Note:** Never commit `.env` files to GitHub. These secrets are stored securely in GitHub.

---

### 3. Initial VPS Setup

On your **VPS**, run these commands:

```bash
# Clone repository
cd ~
git clone https://github.com/mazzampr/moazz-web.git
cd moazz-web

# Create .env file
nano .env
```

Paste this into the `.env` file (replace with your actual values):

```env
DATABASE_URL="postgresql://postgres.xxx:xxx@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:xxx@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"
ADMIN_API_KEY="your-secure-admin-key"
```

Save and exit (Ctrl+X, Y, Enter).

---

### 4. Set Up SSL Certificate

Run this command on your **VPS**:

```bash
# Create certbot directories
mkdir -p ~/moazz-web/certbot/conf
mkdir -p ~/moazz-web/certbot/www

# Start nginx for certificate validation
cd ~/moazz-web
docker compose -f docker-compose.prod.yml up -d nginx

# Get SSL certificate (replace your-email@example.com)
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email your-email@example.com \
    --agree-tos \
    --no-eff-email \
    -d moazz.dev \
    -d www.moazz.dev
```

**Important:** Replace `your-email@example.com` with your actual email.

---

### 5. Initial Deployment

On your **VPS**, run:

```bash
cd ~/moazz-web

# Make deploy script executable
chmod +x deploy-prod.sh

# Run initial deployment
./deploy-prod.sh
```

This will:
- Pull latest code
- Build Docker images
- Start all containers
- Set up SSL

---

### 6. Configure VPS Nginx (Stop Existing Nginx)

Your VPS already has nginx installed, but we're using nginx in Docker. Stop the system nginx:

```bash
# Stop system nginx
sudo systemctl stop nginx
sudo systemctl disable nginx

# Verify Docker nginx is running
docker ps | grep nginx
```

---

### 7. Verify Deployment

Check if everything is running:

```bash
# Check container status (all should be "healthy")
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs

# Test in browser
curl -I https://moazz.dev
```

---

### 8. Test CI/CD Pipeline

Now test automatic deployment:

1. Make a small change in your local code (e.g., edit README)
2. Commit and push:
   ```bash
   git add .
   git commit -m "test: verify CI/CD pipeline"
   git push origin main
   ```
3. Go to: `https://github.com/mazzampr/moazz-web/actions`
4. Watch the deployment run automatically
5. Check your site: `https://moazz.dev`

---

## How CI/CD Works

**Automatic Deployment Flow:**

1. You push code to `main` branch
2. GitHub Actions triggers automatically
3. GitHub connects to your VPS via SSH
4. Pulls latest code
5. Rebuilds Docker containers
6. Restarts services
7. Your site updates with new code

**Manual Deployment:**

You can also trigger deployment manually:
1. Go to: `https://github.com/mazzampr/moazz-web/actions`
2. Click "Deploy to Production"
3. Click "Run workflow"

---

## Useful Commands

On your **VPS**:

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f

# Check status
docker compose -f docker-compose.prod.yml ps

# Restart services
docker compose -f docker-compose.prod.yml restart

# Stop all
docker compose -f docker-compose.prod.yml down

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build

# Clean up old images (save space)
docker image prune -af

# Check disk space
df -h

# Check memory usage
free -h

# View nginx logs
docker compose -f docker-compose.prod.yml logs nginx

# Renew SSL certificate manually
docker compose -f docker-compose.prod.yml run --rm certbot renew
```

---

## Monitoring

### Check Application Health

```bash
# Health check endpoint
curl https://moazz.dev/health

# API health
curl https://moazz.dev/api/v1/projects

# Container health
docker compose -f docker-compose.prod.yml ps
```

### View Logs in Real-time

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f nginx
```

---

## Troubleshooting

### Containers won't start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs

# Check disk space
df -h

# Clean up
docker system prune -a
```

### SSL certificate issues

```bash
# Check certificate
docker compose -f docker-compose.prod.yml exec nginx ls -la /etc/letsencrypt/live/moazz.dev/

# Renew certificate
docker compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal
docker compose -f docker-compose.prod.yml restart nginx
```

### Site not accessible

```bash
# Check if containers are running
docker compose -f docker-compose.prod.yml ps

# Check nginx logs
docker compose -f docker-compose.prod.yml logs nginx

# Test DNS
nslookup moazz.dev

# Check firewall (GCP)
# Make sure ports 80 and 443 are open in GCP firewall rules
```

### Out of memory

```bash
# Check memory
free -h

# Restart services one by one
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml restart frontend
docker compose -f docker-compose.prod.yml restart nginx
```

---

## Security Checklist

- [ ] `.env` file is NOT committed to git
- [ ] Strong `ADMIN_API_KEY` is set
- [ ] SSL certificates are active (https://)
- [ ] GitHub secrets are configured
- [ ] SSH key is secured (only GitHub has access)
- [ ] System nginx is disabled (using Docker nginx)
- [ ] Regular backups of important data

---

## Next Steps

After deployment is successful:

1. **Monitor performance** - Check logs regularly
2. **Set up backups** - Backup your Supabase database
3. **Add monitoring** - Consider Uptime Robot or similar
4. **Update DNS TTL** - Change from 300 to 3600 (1 hour)
5. **Add Google Analytics** - Track visitors
6. **Set up error tracking** - Sentry or similar

---

## Support

If you encounter issues:

1. Check logs: `docker compose -f docker-compose.prod.yml logs`
2. Check GitHub Actions: https://github.com/mazzampr/moazz-web/actions
3. Verify DNS: `nslookup moazz.dev`
4. Check firewall rules in GCP console

---

**Congratulations! Your application is now deployed with automatic CI/CD!**

Every time you push to `main`, your site will automatically update.
