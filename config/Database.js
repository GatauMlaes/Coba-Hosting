import mysql from "mysql" ;

const db = mysql.createConnection({
    host:"localhost",
    database:"ecom",
    user:"root",
    password:""
})

export default db ;
