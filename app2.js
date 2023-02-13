import express from "express";
import Fileupload from "express-fileupload";
import cors from "cors";
import ejs from "ejs" ;

import ecomRoute from "./routes/ecommerceRoute.js"
import methodOverride from "method-override";




const app = express()
const port = 3000

//MiddleWare

app.use(cors())
app.use(Fileupload())
app.use(express.json())
app.set("view engine", "ejs"); //app.set('view engine' , 'Jenis Template Engine ejs')
app.set("views", "views"); //app.set('views' ,'nama direktori views')
app.use(methodOverride('_method'))
app.use(express.static('assets'))
app.use(express.static('public'))


app.use(ecomRoute)



app.listen(port,()=> console.log(`Running On The Port ${port}`))