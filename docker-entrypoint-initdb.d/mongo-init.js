import env from '../app/helper/env.js'


db.auth(env('DB_USER_NAME'), env('DB_PASSWORD'))

print("Started Adding the Users.");
db = db.getSiblingDB(env('DB_NAME'));
db.createUser({
  user: env('DB_USER_NAME'),
  pwd: env('DB_PASSWORD'),
  roles: [{ role: "readWrite", db: env('DB_NAME') }],
});
print("End Adding the User Roles.");