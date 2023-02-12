import express from "express";
import multer from "multer";
import methodOverride from "method-override";
import flash from "connect-flash" ;
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { getProductDashboard, addProductDashboard, saveProductDashboard, deleteProductDashboard, savekw2Product } from "../controller/dashboardController.js";

const route = express.Router()
route.use(methodOverride('_method'))
route.use(flash())
route.use(bodyParser.urlencoded({extended:true}))
route.use(cookieParser('secret'))
route.use(
  session({
  cookie:{maxAge:6000},
  secret:'secret',
  resave:true,
  saveUninitialized:true
}))

const filePath = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./assets");
    },
    filename: (req, file, cb) => {
      cb(null,Date.now()+ file.originalname);
    },
    
  })

  const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
  ]
  
const upload = multer({ 
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "./assets");
        },
        filename: (req, file, cb) => {
          cb(null,Date.now()+ file.originalname);
        },
        
      }),
      fileFilter: (req, file, cb) => {
        if (!whitelist.includes(file.mimetype)) {
            cb(null, false);
            return cb(new Error ("Invalid Images"))

        } else {
            cb(null, true)
        }
    
        
      }

})



route.get("/dashboard",getProductDashboard)
route.get("/add-product",addProductDashboard)
route.post("/add",upload.single("asset"),saveProductDashboard)
route.post("/save-prod",savekw2Product)
route.delete("/:kode_barang",deleteProductDashboard)


export default route ;