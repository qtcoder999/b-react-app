_env='QA';
_path='blackforest';
REACT_APP_ENV=$_env REACT_APP_BASE_HREF=/$_path PUBLIC_URL=. npm run build
 

echo "Password : devices@123"
scp -r build/. onw_user@10.5.203.142:/app/docroot/html/$_path/;
ssh onw_user@10.5.203.142 "chmod -R 755 /app/docroot/html/$_path/";