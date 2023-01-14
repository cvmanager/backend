import env from '../app/helper/env.js'

print("Started Adding the Users.");
db = db.getSiblingDB("admin");
db.createUser({
  user: env('DB_USER_NAME'),
  pwd: env('DB_PASSWORD'),
  roles: [{ role: "readWrite", db: "admin" }],
});
print("End Adding the User Roles.");