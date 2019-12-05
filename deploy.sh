git pull;
npm run build;
echo "devices@123"
scp -r build/. onw_user@10.5.203.142:/app/docroot/html/blackforest/;
ssh onw_user@10.5.203.142 "chmod -R 755 /app/docroot/html/blackforest/";