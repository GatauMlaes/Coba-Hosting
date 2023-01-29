const fs = require("fs")
const express = require("express")
const ejs = require("ejs")
const multer = require("multer")
const methodOverride = require("method-override")
const {urlencoded} = require("express")
const mysql = require("mysql");
const bodyParser = require("body-parser")
const { devNull } = require("os")
const {loadCart,saveCarts,addCart, findCart, deleteCart} = require("./utils/cart")

const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs"); //app.set('view engine' , 'Jenis Template Engine ejs')
app.set("views", "views"); //app.set('views' ,'nama direktori views')
app.use(methodOverride('_method'))
app.use(express.static("public"));
app.use(express.static('assets'))
app.use(methodOverride("_method"))

const dirPath = "./assets";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync("public");
}

const db = mysql.createConnection({
    host:"localhost",
    database:"ecom",
    user:"root",
    password:""
})

const filepath = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets");
      },
    filename:(req,file,cb) => {
        cb(null,file.originalname)
    }
})

const filePath = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./assets");
    },
    filename: (req, file, cb) => {
      cb(null,Date.now()+ file.originalname);
    },
  });
  


const upload = multer({ storage: filePath });

db.connect((err) => {
    if(err)throw err ;

    app.get("/",(req,res) => {
        const sql = "SELECT * FROM tb_barang"
        db.query(sql,(err,result) => {
            if(err) throw err;
            const barang = JSON.parse(JSON.stringify(result, null, 2));
            res.render("homr",{barang})
        })
        
    })

    app.get("/cart", (req,res) => {
        const carts = loadCart()
        const cart = carts.cart
        res.render("cart.ejs",{cart})
    })
    
    app.post("/cart", (req,res) => {
        const inv = `INV${Date.now()}`
        const kode_barang = req.body.kode_barang
        const nama_barang = req.body.nama_barang
        const harga = req.body.harga
        const gambar = req.body.gambar
        const jenis = req.body.jenis
        const qtt = req.body.qtt
        const jumlah_harga = req.body.jumlah_harga
        const produk = {
            inv,
            kode_barang,
            nama_barang,
            harga,
            jumlah_harga,
            qtt,
            gambar,
            jenis
        }
        addCart(produk)
       res.redirect("/cart")
    })

    app.delete("/cart/:inv", (req,res) => {
        const inv = req.params.inv
        deleteCart(inv)

        res.redirect("/cart")

    })

    app.get("/neww",(req,res) => {
        const sql = "SELECT * FROM tb_barang"
        db.query(sql,(err,result) => {
            if(err) throw err;
            const barang = JSON.parse(JSON.stringify(result, null, 2));
            console.log(barang);
            res.render("dashboardneww.ejs",{barang})
            
        })
       
    })

    app.put("/update",upload.single("asset"),(req,res) => {
        const namaBarang = req.body.nama_barang
        const kodeBarang = req.body.kode_barang
        const jenis = req.body.jenis
        const harga = req.body.harga
        const quantitas = req.body.quantitas
        const id = req.body.id

        const namaFile = req.file.filename 
        const sql = `UPDATE tb_barang SET kode_barang = '${kodeBarang}', nama_barang = '${namaBarang}', jenis = '${jenis}', quantitas = '${quantitas}', harga = '${harga}', gambar = '${namaFile}' WHERE tb_barang.id = ${id};`
        db.query(sql,(err,result) => {
            if(err)throw err;
            res.redirect("/dashboard")
        })
    })
    app.put("/:id",(req,res) => {
        
       const kodeBarang = req.params.id
        const sql = `SELECT * FROM tb_barang WHERE kode_barang ='${kodeBarang}';`
        db.query(sql,(err,result) => {
            if(err)throw err;
            const barang = JSON.parse(JSON.stringify(result, null, 2));
            res.render("edit-product.ejs",{barang})
        })
    })

    app.delete("/:id",(req,res) => {
        const kodeBarang = req.params.id
        const sql = `DELETE FROM tb_barang WHERE tb_barang.kode_barang = '${kodeBarang}'`
        db.query(sql,(err,result) => {
            if(err)throw err;
            res.redirect("/")
        })

    })
    app.get("/dashboard",(req,res) => {
        const sql = "SELECT * FROM tb_barang"
        db.query(sql,(err,result) => {
            if(err) throw err;
            const barang = JSON.parse(JSON.stringify(result, null, 2));
            console.log(barang);
            res.render("dashborad.ejs",{barang})
        })
        
    })
    
    app.get("/add",(req,res) => {
        res.render("add-product.ejs")
    })
    
    app.post("/",upload.single("asset"),(req,res) =>{
        const namaBarang = req.body.nama_barang
        const kodeBarang = req.body.kode_barang
        const jenis = req.body.jenis
        const harga = req.body.harga
        const quantitas = req.body.quantitas
        const namaFile = req.file.filename 
        const sql = `INSERT INTO tb_barang (id, kode_barang, nama_barang, jenis, quantitas, harga, gambar) VALUES (NULL, '${kodeBarang}', '${namaBarang}', '${jenis}', ${quantitas}, ${harga}, '${namaFile}');`
        db.query(sql,(err,result) => {
            if(err)throw err;
            res.redirect("/add")
        })

    
    })

    app.put("/edit-product",(req,res) =>{
        res.send("woila")
    })
    
    
    
    
    
    app.get("/inv",(req,res) => {
        res.render("dash.ejs")
    })
    app.get("/items",(req,res) => {
        res.render("dash.ejs")
    })

})





app.listen(3320,() => {
    console.log(`Running on the port 3320`);
})