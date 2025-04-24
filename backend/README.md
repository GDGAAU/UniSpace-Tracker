To start the backend first make sure to have started docker with docker up dev-db -d or docker-compose up dev-db -d
Then make sure to npx prisma migrate dev --name init 
and finally npx prisma generate && npm run db:seed 


make sure to npm install after git clone 
finally npm run dev for backend to start...
