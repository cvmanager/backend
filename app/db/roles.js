const roles = [
    {
       "_id": "636793ebed4e4ba2664f2cbe",
       "name": "System Manager",
       "description": "",
       "deleted": false,
       "permissions": []
   },
   {
     "_id": "6367942bed4e4ba2664f2cc8",
     "name": "Company Manager",
     "description": "",
     "parent": "636793ebed4e4ba2664f2cbe",
     "deleted": false,
     "permissions": []
   },
   {
     "_id": "6367943ced4e4ba2664f2ccd",
     "name": "Project Manager",
     "description": "",
     "parent": "6367942bed4e4ba2664f2cc8",
     "deleted": false,
     "permissions": []
   },{
     "_id": "63da0055a4f2761d3ba81d71",
     "name": "Position Manager",
     "description": "",
     "parent": "6367943ced4e4ba2664f2ccd",
     "deleted": false,
     "permissions": []
   },
   {
     "_id": "6367943ced4e4ba2664f2cde",
     "name": "Owner",
     "description": "",
     "deleted": false,
     "permissions": []
   }
]

export default roles