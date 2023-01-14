#!/bin/bash
set -e

mongo <<EOF
use "cvmanager" 
db.createUser(
  {
    user: "root",
    pwd: "yP6tZ3LwD7VrB",
    roles: [ { role: "userAdminAnyDatabase", db: "cvmanager" }, "readWriteAnyDatabase" ]
  }
)

EOF

