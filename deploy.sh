#!/bin/bash

# Exit on error
set -e

# Check if domain name is provided
if [ -z "$1" ]; then
    echo "Error: Domain name is required"
    echo "Usage: ./deploy.sh yourdomain.com"
    exit 1
fi

DOMAIN=$1

# Check if server has a public IP
PUBLIC_IP=$(curl -s ifconfig.me)
if [ -z "$PUBLIC_IP" ]; then
    echo "Error: Could not determine server's public IP address"
    exit 1
fi

echo "Server's public IP: $PUBLIC_IP"
echo "Please ensure your domain $DOMAIN points to this IP address"
read -p "Press Enter to continue..."

# Check if database credentials are set
if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ]; then
    echo "Error: Database credentials not set"
    echo "Please set DB_USER, DB_PASSWORD, and DB_NAME environment variables"
    exit 1
fi

# Update system
echo "Updating system..."
sudo apt update
sudo apt upgrade -y

# Install required packages
echo "Installing required packages..."
sudo apt install -y nginx python3-pip python3-venv nodejs npm certbot python3-certbot-nginx

# Create project directory
echo "Creating project directory..."
sudo mkdir -p /var/www/studentmarketplace
sudo chown -R $USER:$USER /var/www/studentmarketplace

# Clone repository (if not already done)
if [ ! -d "/var/www/studentmarketplace/.git" ]; then
    echo "Cloning repository..."
    git clone https://github.com/yourusername/StudentMarketPlace.git /var/www/studentmarketplace
fi

# ... existing code ... 