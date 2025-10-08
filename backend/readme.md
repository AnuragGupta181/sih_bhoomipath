# BhoomiPath Backend Setup Guide

This README explains how to set up and deploy the **SIH BhoomiPath Backend** on **Google Cloud Compute Engine** using **Docker** and **Nginx with SSL**.

---

## 🏗️ Project Overview

BhoomiPath is a backend service containerized using Docker and deployed on Google Cloud. The backend runs on **Flask** (Python) and listens on port **8000**.

---

## ⚙️ Step 1: Setting Up the Backend Locally

### 1. Create Docker and .dockerignore Files

**Dockerfile:**

```dockerfile
# Use official Python base image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Copy dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source files
COPY . .

# Expose port 8000
EXPOSE 8000

# Start the Flask app
CMD ["python", "app.py"]
```

**.dockerignore:**

```
__pycache__
*.pyc
*.pyo
*.pyd
.env
.git
.gitignore
Dockerfile
.dockerignore
```

### 2. Build and Run Docker Image Locally

```bash
docker build -t sih-bhoomipath-backend .
docker run --env-file .env -p 8000:8000 sih-bhoomipath-backend:slim
```

---

## ☁️ Step 2: Set Up Google Cloud VM

1. Go to **Compute Engine → VM Instances → Create Instance**.

2. Choose:

   * **Region:** asia-south1 (Mumbai)
   * **Machine type:** e2-small or e2-medium (2 vCPU, 4 GB RAM)
   * **Boot disk:** Ubuntu 22.04 LTS (30 GB or more)
   * **Firewall:** Check both **Allow HTTP** and **Allow HTTPS**

3. Click **Create** and wait for your VM to start.

---

## 💻 Step 3: Connect and Configure VM

SSH into your VM and run:

```bash
sudo apt-get update && sudo apt upgrade -y
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
exit
```

Reconnect to the VM, then upload your `.env` file.

To verify:

```bash
ls -a
cat .env
```

---

## 🐳 Step 4: Pull and Run Docker Image

```bash
docker pull anurag181/sih-bhoomipath-backend:slim
docker run --env-file .env -p 8000:8000 anurag181/sih-bhoomipath-backend:slim
```

### ✅ Allow Port 8000 in Google Cloud

Go to **VPC Network → Firewall → Create Rule**:

* Name: `allow-port-8000`
* Targets: All instances in the network
* Protocols/Ports: `tcp:8000`

Save and apply.

---

## 🌐 Step 5: Install and Configure Nginx

### Install Nginx and SSL Tools

```bash
sudo apt-get install nginx openssl -y
sudo systemctl status nginx
```

### Generate Self-Signed SSL Certificate

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout /etc/ssl/private/selfsigned.key \
-out /etc/ssl/certs/selfsigned.crt
```

### Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/bhoomipath
```

Paste the following:

```nginx
server {
    listen 80;
    server_name 34.131.110.48;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name 34.131.110.48;

    ssl_certificate /etc/ssl/certs/selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/selfsigned.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and Test Configuration:

```bash
sudo ln -s /etc/nginx/sites-available/bhoomipath /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Configure Firewall (UFW)

```bash
sudo apt install ufw -y
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 🔒 Step 6: Verify Deployment

Open your browser and go to:

```
https://34.131.110.48/
```

You should see your Flask backend running securely over HTTPS.

---

## 🚀 Summary

✅ Docker container for Flask backend
✅ Deployment on Google Cloud VM
✅ Reverse proxy and SSL with Nginx
✅ Accessible at: `https://34.131.110.48/`

---

**Author:** Anurag Gupta
**Project:** SIH BhoomiPath Backend
**Cloud Provider:** Google Cloud (Compute Engine)
