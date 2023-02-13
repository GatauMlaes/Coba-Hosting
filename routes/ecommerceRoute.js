import { getProductDashboard, addProductDashboard, saveProductDashboard, deleteProductDashboard, updateProduct, updateProductDashboard,} from "../controller/dashboardController.js";
import {getProductEcom} from "../controller/ecommerceController.js"
import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import flash from "connect-flash" ;
import session from "express-session";
import cookieParser from "cookie-parser";


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


route.get("/",getProductEcom)
route.get("/dashboard",getProductDashboard)
route.get("/add-product",addProductDashboard)
route.post("/add",saveProductDashboard)
route.put("/update",updateProductDashboard)
route.put("/:kode_barang",updateProduct)


route.delete("/:kode_barang",deleteProductDashboard)


export default route ;