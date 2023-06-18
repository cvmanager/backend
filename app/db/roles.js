let systemManager = {
  "_id": "636793ebed4e4ba2664f2cbe",
  "name": "System Manager",
  "description": "",
  "deleted": false,
  "permissions": []
}
let companyManager = {
  "_id": "6367942bed4e4ba2664f2cc8",
  "name": "Company Manager",
  "description": "",
  "parent": systemManager._id,
  "deleted": false,
  "permissions": []
}
let projectManager = {
  "_id": "6367943ced4e4ba2664f2ccd",
  "name": "Project Manager",
  "description": "",
  "parent": companyManager._id,
  "deleted": false,
  "permissions": []
}
let positionManager = {
  "_id": "63da0055a4f2761d3ba81d71",
  "name": "Position Manager",
  "description": "",
  "parent": projectManager._id,
  "deleted": false,
  "permissions": []
}
let owner = {
  "_id": "6367943ced4e4ba2664f2cde",
  "name": "Owner",
  "description": "",
  "parent": positionManager._id,
  "deleted": false,
  "permissions": []
}
const roles = [systemManager, companyManager, projectManager, positionManager, owner]

export default roles