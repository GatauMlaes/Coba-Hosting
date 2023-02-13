import db from "../config/Database.js";
import ejs from "ejs";
import path from "path";
import fs from "fs";
import flash from "connect-flash" ;

export const getProductEcom = (req,res) => {
    const sql = "SELECT * FROM tb_barang"

    db.query(sql,(err,result) => {
        if(err) throw err;
        const product = JSON.parse(JSON.stringify(result,null,2))

        res.render("ecom.ejs", {product})
    })
    
}