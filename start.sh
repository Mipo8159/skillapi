ENV=$1 || 'development'

npm run migrate:latest 

if [ "$ENV" = "production" ]; then
    node dist/src/main.js
elif [ "$ENV" = "development" ]; then
    npm run start:dev 
fi