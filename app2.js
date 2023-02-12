import express from "express";
import cors from "cors";
import ejs from "ejs" ;
import bodyParser from "body-parser";
import ecomRoute from "./routes/ecommerceRoute.js"
import multer from "multer";
import methodOverride from "method-override";
import fileUpload from "express-fileupload";



const app = express()
const port = 3000

//MiddleWare
app.use(ecomRoute)
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(express.json())
app.set("view engine", "ejs"); //app.set('view engine' , 'Jenis Template Engine ejs')
app.set("views", "views"); //app.set('views' ,'nama direktori views')
app.use(methodOverride('_method'))
app.use(express.static('assets'))
app.use(fileUpload())



app.listen(port,()=> console.log(`Running On The Port ${port}`))