# Dockerized Node.js Service with CI/CD Pipeline

A production-ready Node.js service demonstrating end-to-end DevOps practices including containerization, automated CI/CD pipelines, infrastructure provisioning, and secure deployment strategies.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Docker Setup](#docker-setup)
- [Server Provisioning](#server-provisioning)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Security Considerations](#security-considerations)
- [Monitoring and Logs](#monitoring-and-logs)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project demonstrates a complete DevOps workflow by deploying a simple Node.js REST API service using Docker containers, automated CI/CD with GitHub Actions, and secure deployment to a remote Linux server.

### Project Goals

- Containerize a Node.js application using Docker best practices
- Implement automated CI/CD pipeline with GitHub Actions
- Deploy to production infrastructure with zero-downtime strategies
- Manage secrets securely across environments
- Follow DevOps and security best practices

## ✨ Features

- **RESTful API**: Simple Express.js server with two endpoints
- **Basic Authentication**: Protected `/secret` route with credentials
- **Dockerized**: Multi-stage Docker build with optimized image size
- **Automated CI/CD**: GitHub Actions pipeline for build and deployment
- **Health Checks**: Container health monitoring
- **Secrets Management**: Environment-based configuration
- **Security Hardened**: Non-root containers, SSH keys, firewall rules
- **Production Ready**: Graceful shutdown, logging, error handling

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Developer Workflow                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ git push
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       GitHub Repository                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              GitHub Actions Workflow                   │ │
│  │  ┌──────────────┐         ┌──────────────┐           │ │
│  │  │  Build Job   │────────▶│  Deploy Job  │           │ │
│  │  │              │         │              │           │ │
│  │  │ • Checkout   │         │ • SSH Connect│           │ │
│  │  │ • Build Image│         │ • Pull Image │           │ │
│  │  │ • Push to    │         │ • Stop Old   │           │ │
│  │  │   Registry   │         │ • Start New  │           │ │
│  │  └──────────────┘         └──────────────┘           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ docker push
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Docker Hub                            │
│                  (Container Registry)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ docker pull
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Production Server (VPS)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Docker Engine                       │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         Node.js Container                        │ │ │
│  │  │  • Express.js Server                             │ │ │
│  │  │  • Port 3000                                     │ │ │
│  │  │  • Health Checks                                 │ │ │
│  │  │  • Auto-restart                                  │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Security: UFW Firewall, SSH Keys, Non-root User            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
                          End Users
```

## 🛠️ Technologies Used

### Backend & Runtime
- **Node.js** (v18) - JavaScript runtime
- **Express.js** (v4.18) - Web application framework
- **dotenv** (v16.3) - Environment variable management

### Containerization
- **Docker** - Container platform
- **Docker Compose** - Multi-container orchestration
- **Docker Hub** - Container registry

### CI/CD & Automation
- **GitHub Actions** - Workflow automation
- **GitHub Secrets** - Encrypted secrets management

### Infrastructure & Cloud
- **DigitalOcean/AWS EC2** - Virtual Private Server
- **Ubuntu 22.04 LTS** - Linux distribution
- **systemd** - Service management

### Security
- **SSH** - Secure remote access
- **UFW** - Uncomplicated Firewall
- **Basic Authentication** - API endpoint protection

### Version Control
- **Git** - Version control system
- **GitHub** - Repository hosting

## 📦 Prerequisites

### For Local Development
- Node.js (v18 or higher)
- Docker (v24 or higher)
- Docker Compose (v2 or higher)
- Git

### For Deployment
- GitHub account
- Docker Hub account
- VPS provider account (DigitalOcean/AWS/etc.)
- SSH key pair
- Domain name (optional)

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/dockerized-nodejs-service.git
cd dockerized-nodejs-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
SECRET_MESSAGE=This is a super secret message!
USERNAME=admin
PASSWORD=securepass123
PORT=3000
NODE_ENV=development
```

### 4. Run the Application

```bash
npm start
```

The server will start at `http://localhost:3000`

### 5. Test the Endpoints

**Root endpoint:**
```bash
curl http://localhost:3000/
# Response: Hello, world!
```

**Secret endpoint (without auth):**
```bash
curl http://localhost:3000/secret
# Response: {"error":"Authentication required"}
```

**Secret endpoint (with auth):**
```bash
curl -u admin:securepass123 http://localhost:3000/secret
# Response: {"message":"This is a super secret message!","authenticated":true}
```

## 🐳 Docker Setup

### Build Docker Image

```bash
docker build -t nodejs-service:latest .
```

### Run Container Locally

```bash
docker run -d \
  --name nodejs-service \
  -p 3000:3000 \
  -e SECRET_MESSAGE="This is a super secret message!" \
  -e USERNAME="admin" \
  -e PASSWORD="securepass123" \
  nodejs-service:latest
```

### Using Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Verify Container

```bash
# Check running containers
docker ps

# View logs
docker logs nodejs-service

# Execute commands inside container
docker exec -it nodejs-service sh
```

## 🖥️ Server Provisioning

### 1. Create VPS Instance

**DigitalOcean:**
- **Image**: Ubuntu 22.04 LTS
- **Plan**: Basic ($6/month, 1GB RAM)
- **Authentication**: SSH Key
- **Firewall**: Configure ports 22, 80, 443, 3000

**AWS EC2:**
- **AMI**: Ubuntu 22.04 LTS
- **Instance Type**: t2.micro (Free tier)
- **Security Group**: Allow ports 22, 80, 443, 3000
- **Key Pair**: Create/use existing

### 2. Initial Server Setup

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Update system packages
apt update && apt upgrade -y

# Create non-root user
adduser deploy
usermod -aG sudo deploy

# Setup SSH for deploy user
su - deploy
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste your public SSH key
chmod 600 ~/.ssh/authorized_keys
exit
```

### 3. Harden SSH

```bash
sudo nano /etc/ssh/sshd_config
```

Update these settings:
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Restart SSH:
```bash
sudo systemctl restart sshd
```

### 4. Configure Firewall

```bash
# Install UFW
sudo apt install ufw -y

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (IMPORTANT!)
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application port
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

### 5. Install Docker

```bash
# Remove old versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt update
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker deploy
newgrp docker

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Verify installation
docker --version
docker compose version
```

### 6. Create Application Directory

```bash
mkdir -p ~/apps/nodejs-service
cd ~/apps/nodejs-service
```

## 🔄 CI/CD Pipeline

### Pipeline Overview

The GitHub Actions workflow consists of two jobs:

1. **Build Job**: Builds Docker image and pushes to Docker Hub
2. **Deploy Job**: Pulls image on server and deploys container

### Workflow Triggers

- Push to `main` branch
- Manual trigger via GitHub Actions UI

### Setup GitHub Secrets

Navigate to: **Repository → Settings → Secrets and variables → Actions**

Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DOCKERHUB_USERNAME` | Docker Hub username | `johndoe` |
| `DOCKERHUB_TOKEN` | Docker Hub access token | `dckr_pat_...` |
| `SERVER_HOST` | Production server IP | `192.168.1.100` |
| `SERVER_USER` | SSH user on server | `deploy` |
| `SERVER_SSH_KEY` | Private SSH key | Contents of `~/.ssh/id_ed25519` |
| `SECRET_MESSAGE` | Application secret message | `Production Secret!` |
| `APP_USERNAME` | Basic auth username | `prodadmin` |
| `APP_PASSWORD` | Basic auth password | `prod_pass_123` |

### Workflow File Location

```
.github/workflows/deploy.yml
```

### Pipeline Stages

**Stage 1: Build**
- Checkout code
- Setup Docker Buildx
- Login to Docker Hub
- Extract metadata (tags, labels)
- Build and push Docker image
- Cache layers for faster builds

**Stage 2: Deploy**
- SSH into production server
- Pull latest Docker image
- Stop old container
- Start new container with environment variables
- Clean up unused images
- Logout from Docker Hub

### Manual Deployment Trigger

1. Go to **Actions** tab in GitHub
2. Select **Build and Deploy** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## 📡 Deployment

### Automated Deployment (Recommended)

Simply push to main branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions will automatically:
1. Build Docker image
2. Push to Docker Hub
3. Deploy to production server

### Manual Deployment

If you prefer manual deployment:

```bash
# SSH into server
ssh deploy@YOUR_SERVER_IP

# Pull latest image
docker pull YOUR_DOCKERHUB_USERNAME/nodejs-service:latest

# Stop old container
docker stop nodejs-service
docker rm nodejs-service

# Run new container
docker run -d \
  --name nodejs-service \
  --restart unless-stopped \
  -p 3000:3000 \
  -e SECRET_MESSAGE="Production Secret!" \
  -e USERNAME="prodadmin" \
  -e PASSWORD="prod_pass_123" \
  -e NODE_ENV=production \
  YOUR_DOCKERHUB_USERNAME/nodejs-service:latest

# Verify deployment
docker ps
curl http://localhost:3000/
```

### Rollback Strategy

To rollback to a previous version:

```bash
# Find previous image tag
docker images | grep nodejs-service

# Stop current container
docker stop nodejs-service
docker rm nodejs-service

# Run previous version
docker run -d \
  --name nodejs-service \
  --restart unless-stopped \
  -p 3000:3000 \
  -e SECRET_MESSAGE="Production Secret!" \
  -e USERNAME="prodadmin" \
  -e PASSWORD="prod_pass_123" \
  YOUR_DOCKERHUB_USERNAME/nodejs-service:main-abc1234
```

## 📚 API Documentation

### Base URL

```
http://YOUR_SERVER_IP:3000
```

### Endpoints

#### `GET /`

Returns a welcome message.

**Request:**
```bash
curl http://YOUR_SERVER_IP:3000/
```

**Response:**
```
Hello, world!
```

**Status Codes:**
- `200 OK`: Success

---

#### `GET /secret`

Returns a secret message. Requires Basic Authentication.

**Request:**
```bash
curl -u username:password http://YOUR_SERVER_IP:3000/secret
```

**Response (Success):**
```json
{
  "message": "This is a super secret message!",
  "authenticated": true
}
```

**Response (No Auth):**
```json
{
  "error": "Authentication required"
}
```

**Response (Invalid Credentials):**
```json
{
  "error": "Invalid credentials"
}
```

**Status Codes:**
- `200 OK`: Authentication successful
- `401 Unauthorized`: Missing or invalid credentials

**Headers:**
```
Authorization: Basic <base64(username:password)>
```

---

#### `GET /health` (Optional - if implemented)

Health check endpoint for monitoring.

**Request:**
```bash
curl http://YOUR_SERVER_IP:3000/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-08T10:30:00.000Z",
  "uptime": 3600.5
}
```

**Status Codes:**
- `200 OK`: Service is healthy

## 🔒 Security Considerations

### Application Security

- Environment variables for secrets (never hardcoded)
- `.env` file excluded from Git and Docker images
- Basic Authentication for protected endpoints
- No sensitive data in logs or error messages
- Non-root user in Docker container

### Infrastructure Security

- SSH key-based authentication (no passwords)
- Root login disabled
- UFW firewall configured
- Only necessary ports exposed
- Regular system updates

### CI/CD Security

- GitHub Secrets for sensitive data
- Secret masking in logs
- Docker Hub tokens with limited scope
- SSH private key never exposed
- Environment-based configuration

### Best Practices Implemented

1. **Principle of Least Privilege**: Minimal permissions for users and containers
2. **Defense in Depth**: Multiple security layers (firewall, SSH, container isolation)
3. **Secrets Rotation**: Easy to rotate credentials via GitHub Secrets
4. **Audit Trail**: Git history and GitHub Actions logs
5. **Container Isolation**: Each service in separate container

## 📊 Monitoring and Logs

### View Application Logs

```bash
# Via Docker
docker logs nodejs-service

# Follow logs (real-time)
docker logs -f nodejs-service

# Last 100 lines
docker logs --tail 100 nodejs-service

# With timestamps
docker logs -t nodejs-service
```

### Container Stats

```bash
# Resource usage
docker stats nodejs-service

# Container details
docker inspect nodejs-service
```

### Health Check Status

```bash
# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# Detailed health info
docker inspect --format='{{json .State.Health}}' nodejs-service | jq
```

### System Logs

```bash
# System journal logs
sudo journalctl -u docker

# Kernel logs
dmesg | tail
```

### GitHub Actions Logs

1. Navigate to **Actions** tab in GitHub
2. Click on workflow run
3. Expand jobs and steps to view logs
4. Download logs for offline analysis

## 🐛 Troubleshooting

### Common Issues

#### Container Won't Start

**Symptom:** Container exits immediately after starting

**Solution:**
```bash
# Check logs for errors
docker logs nodejs-service

# Common issues:
# 1. Port already in use
sudo lsof -i :3000

# 2. Missing environment variables
docker inspect nodejs-service | grep -A 10 Env

# 3. Application error
docker exec -it nodejs-service sh
node server.js  # Run manually to see errors
```

#### Cannot Connect to Server

**Symptom:** Connection refused or timeout

**Solution:**
```bash
# Check if container is running
docker ps

# Check if port is exposed
docker port nodejs-service

# Check firewall rules
sudo ufw status

# Check if service is listening
sudo netstat -tlnp | grep 3000

# Test locally on server
curl http://localhost:3000/
```

#### Authentication Not Working

**Symptom:** Always returns 401 Unauthorized

**Solution:**
```bash
# Check environment variables
docker exec nodejs-service printenv | grep -E 'USERNAME|PASSWORD'

# Test with exact credentials
curl -v -u admin:securepass123 http://localhost:3000/secret

# Check Basic Auth header encoding
echo -n "admin:securepass123" | base64
```

#### CI/CD Pipeline Fails

**Symptom:** GitHub Actions workflow fails

**Solutions:**

**Build Job Fails:**
```bash
# Common issues:
# 1. Docker Hub authentication
# Verify DOCKERHUB_USERNAME and DOCKERHUB_TOKEN secrets

# 2. Dockerfile syntax error
# Test locally: docker build -t test .

# 3. npm install fails
# Check package.json and package-lock.json
```

**Deploy Job Fails:**
```bash
# Common issues:
# 1. SSH connection fails
# Verify SERVER_HOST, SERVER_USER, SERVER_SSH_KEY

# 2. Permission denied
# Check if deploy user is in docker group

# 3. Port already in use
# Stop old container manually
```

#### Docker Hub Rate Limit

**Symptom:** Error pulling images

**Solution:**
```bash
# Login to Docker Hub
docker login

# Check rate limits
curl "https://auth.docker.io/token?service=registry.docker.io&scope=repository:ratelimitpreview/test:pull" | jq

# Use authenticated pulls
# Already implemented in workflow
```

### Debug Mode

Enable verbose logging:

```javascript
// In server.js
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('Username configured:', !!process.env.USERNAME);
console.log('Password configured:', !!process.env.PASSWORD);
```

### Health Check Commands

```bash
# Test from inside container
docker exec nodejs-service wget -O- http://localhost:3000/

# Test network connectivity
docker exec nodejs-service ping -c 3 google.com

# Check DNS resolution
docker exec nodejs-service nslookup github.com
```


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by [Your Name]**
