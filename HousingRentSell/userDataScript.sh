#!/bin/bash
set -euo pipefail

exec > /var/log/user-data.log 2>&1
set -x

sudo yum update -y
sudo yum install -y git nginx
sudo dnf install -y nodejs npm
sudo npm install -g pm2

sudo mkdir -p /home/ec2-user/app
sudo chown -R ec2-user:ec2-user /home/ec2-user/app

sudo systemctl enable nginx
sudo systemctl start nginx

cd /home/ec2-user/app
sudo -u ec2-user git clone https://github.com/anshulagarwal541/AWS_HousingRentSell.git project

cat > /home/ec2-user/app/project/HousingRentSell/Server/.env <<'EOF'
SECRET_KEY=<any-secret-string>
AWS_REGION=<region>
AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
AWS_S3_BUCKET_NAME=<bucket-name>
GEOAPIFY_KEY=<geoapi-key>
EOF

cat > /home/ec2-user/app/project/HousingRentSell/Client/propertyRentSell/.env <<'EOF'
VITE_MAPBOX_TOKEN=<mapbox-token>
EOF

cd /home/ec2-user/app/project/HousingRentSell/Server
sudo -u ec2-user npm install

cd /home/ec2-user/app/project/HousingRentSell/Client/propertyRentSell
sudo -u ec2-user npm install
sudo -u ec2-user npm run build

cd /home/ec2-user/app/project/HousingRentSell/Server
sudo -u ec2-user pm2 start app.js --name housing-backend
sudo -u ec2-user pm2 save

sudo rm -rf /usr/share/nginx/html/*
sudo cp -r /home/ec2-user/app/project/HousingRentSell/Client/propertyRentSell/dist/* /usr/share/nginx/html/

sudo systemctl restart nginx

sudo tee /etc/nginx/conf.d/app.conf > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo nginx -t
sudo systemctl restart nginx