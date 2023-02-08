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
const { count } = require("console")
const { createSecureContext } = require("tls")
const { url } = require("inspector")

const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs"); //app.set('view engine' , 'Jenis Template Engine ejs')
app.set("views", "views"); //app.set('views' ,'nama direktori views')
app.use(methodOverride('_method'))
app.use(express.static("public"));
app.use(express.static('assets'))
app.use(methodOverride("_method"))

const diryPath = "./assets";
if (!fs.existsSync(diryPath)) {
  fs.mkdirSync("public");
}

//CHECKOUT FILE 

const dirPath = "./data"
if(!fs.existsSync(dirPath)){
    fs.mkdirSync("data")
}



const dataPath = "./data/checkout.json"
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '{"cart":[] }', "utf-8")
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
            res.render("home",{barang})
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
       res.redirect("/")
    })

    app.delete("/cart/:inv", (req,res) => {
        const inv = req.params.inv
        deleteCart(inv)

        res.redirect("/cart")

    })

    app.get("/dashboard",(req,res) => {
        const sql = "SELECT * FROM tb_barang "
        db.query(sql,(err,result) => {
            if(err) throw err;
            const barang = JSON.parse(JSON.stringify(result, null, 2));
            const jumlahDataPerHalaman=5
            const jumlahData = barang.length
            let jumlahHalaman = Math.ceil(jumlahData/jumlahDataPerHalaman)
            let halamanAktif = (req.query.page) ?req.query.page :1
        
            let awalData = (jumlahDataPerHalaman * halamanAktif) - jumlahDataPerHalaman
            const sql2 = `SELECT * FROM tb_barang LIMIT ${awalData},${jumlahDataPerHalaman}`
            db.query(sql2,(errorr,hasil) => {
                if(errorr) throw errorr;
                
                const product = JSON.parse(JSON.stringify(hasil, null, 2));
                res.render("dashboardneww.ejs",{product,jumlahHalaman,halamanAktif,barang})
            })
            
            
        })
       
    })

    app.get("/order",(req,res) => {
        const sql = `SELECT * FROM tb_tranksaksi`
        db.query(sql,(err,result) => {
            if(err) throw err ;
            const barang = JSON.parse(JSON.stringify(result, null, 2));
            const jumlahData = barang.length
            const jumlahDataPerHalaman=5
            let jumlahHalaman = Math.ceil(jumlahData/jumlahDataPerHalaman)
            let halamanAktif = (req.query.page) ?req.query.page :1
            let awalData = (jumlahDataPerHalaman * halamanAktif) - jumlahDataPerHalaman
            const sql2 = `SELECT * FROM tb_tranksaksi LIMIT ${awalData},${jumlahDataPerHalaman}`
            db.query(sql2,(error,hasil) => {
                if(error) throw error ;
                const product = JSON.parse(JSON.stringify(hasil, null, 2));
     
                res.render("order.ejs",{product,jumlahHalaman,halamanAktif,barang})
            })
           
        })
    })


    app.post("/dashboard",(req,res) => {
      
    
        const sql = `SELECT * FROM tb_barang WHERE nama_barang LIKE '%${req.query.keyword}%' OR jenis LIKE '%${req.query.keyword}%'`
        db.query(sql,(err,result) => {
            if(err) throw err;
            const barang = JSON.parse(JSON.stringify(result, null, 2));
         
            let textBody = ""
            barang.forEach(el => {
                textBody+=`<tr>
                <td> 
                    <img alt="" src="${el.gambar}" width="50px">
                    <a class="text-heading font-semibold" href="#">
                    ${el.nama_barang}
                    </a>
                </td>
                <td>
                ${el.harga}
                </td>
                <td>
                  <i class="bi bi-box"></i>
                    <a class="text-heading font-semibold" href="#">
                    ${el.quantitas}
                    </a>
                </td>
                <td>
                ${el.jenis}
                </td>
                <td>
                    <span class="badge badge-lg badge-dot">
                        <i class="bg-success"></i>${el.kode_barang}
                    </span>
                </td>
                <td class="text-end">
                  <form action="/${el.kode_barang}?_method=PUT" method="post">
                      
                      <button type="submit" class="btn btn-sm btn-square btn-neutral text-danger-hover"><i class="bi bi-pen"></i></button></form>
                </td>
                <td class="text-end">

                    <form action="/${el.kode_barang}?_method=DELETE" method="post">
                      <input type="hidden" name="gambar" value="GAMBAR">
                      <button type="submit" class="btn btn-sm btn-square btn-neutral text-danger-hover" onclick="return confirm('Yakin Mau Menghapus ?')"> <i class="bi bi-trash"></i></button></form>
                </td>
            </tr>`
            })
            const respon =`<table class="table table-hover table-nowrap">
            <thead class="thead-light">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Type</th>
                    <th scope="col">Item Code</th>
                    <th></th>
                </tr>
            </thead>
            
            <tbody>

            ${textBody}

            </tbody>
        </table>`
      
            res.send(respon)
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
        const gambar = req.body.gambar
        fs.unlinkSync(`./assets/${gambar}`)
        const sql = `DELETE FROM tb_barang WHERE tb_barang.kode_barang = '${kodeBarang}'`
        db.query(sql,(err,result) => {
            if(err)throw err;
            res.redirect("/dashboard")
        })

    })

    

    app.get("/add-product",(req,res) => {
        res.render("add.ejs")
    })

    app.post("/checkout",(req,res) => {
        const carts = loadCart()
        for(let i = 0 ; i < carts.cart.length ; i++){
          
            const cart = carts.cart[i]


            const sql = `INSERT INTO tb_tranksaksi (no_invoice, kode_barang, quantitas, harga, sub_harga,jenis,gambar) VALUES ('${cart.inv}', '${cart.kode_barang}', '${cart.qtt}', '${cart.harga}', '${cart.jumlah_harga}','${cart.jenis}','${cart.gambar}');`
            db.query(sql,(err,result) => {
                if(err) throw err;
            })
        }
        res.redirect("/")

        
    })
    
    app.post("/add",upload.single("asset"),(req,res) =>{
        const namaBarang = req.body.nama_barang
        const kodeBarang = req.body.kode_barang
        const jenis = req.body.jenis
        const harga = req.body.harga
        const quantitas = req.body.quantitas
        const deskripsi = req.body.deskripsi
        const namaFile = req.file.filename
        // console.log(req.file.mimetype); 
        
        const sql = `INSERT INTO tb_barang (id, kode_barang, nama_barang, jenis, quantitas, harga, gambar,deskripsi) VALUES (NULL, '${kodeBarang}', '${namaBarang}', '${jenis}', ${quantitas}, ${harga}, '${namaFile}', '${deskripsi}');`
        db.query(sql,(err,result) => {
            if(err)throw err;
            res.redirect("/add-product")
        })

    
    })

    // app.put("/edit-product",(req,res) =>{
    //     res.send("woila")
    // })


    
    
    
    
    


})





app.listen(3000,() => {
    console.log(`Running on the port 3000`);
})