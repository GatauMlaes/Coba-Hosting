import db from "../config/Database.js";
import ejs from "ejs";
import path from "path";
import fs from "fs";
import flash from "connect-flash" ;

export const getProductDashboard =  (req, res) => {
  try {
    const sql = "SELECT * FROM tb_barang";
     db.query(sql, (err, result) => {
      if (err) throw err;
      //Pagination
      const product = JSON.parse(JSON.stringify(result, null, 2));
      const jumlahDataPerHalaman = 5;
      const jumlahData = product.length;
      let jumlahHalaman = Math.ceil(jumlahData / jumlahDataPerHalaman);
      let halamanAktif = req.query.page ? req.query.page : 1;
      let awalData = jumlahDataPerHalaman * halamanAktif - jumlahDataPerHalaman;

      const sql2 = `SELECT * FROM tb_barang LIMIT ${awalData},${jumlahDataPerHalaman}`;
      db.query(sql2, (fault, resultPagination) => {
        if (fault) throw fault;
        const productPagination = JSON.parse(
          JSON.stringify(resultPagination, null, 2)
        );
        res.render("dashboardneww.ejs", {
          productPagination,
          jumlahHalaman,
          halamanAktif,
          product,
        });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const addProductDashboard = (req, res) => {
  try {
    res.render("add.ejs",
    {
      msg:req.flash('msg')
    });
  } catch (error) {
    console.log(error.message);
  }
};


export const saveProductDashboard = (req,res) => {
  const file = req.files.asset
  const fileSize = file.data.length;
  const ext = path.extname(file.name) 
  const fileName = file.md5 + ext ;
  const url = `${req.protocol}://${req.get("host")}/image/${fileName}`
  const allowedType = [".png",".jpg",".jpeg"]

  if(!allowedType.includes(ext.toLowerCase())){
    req.flash('msg','Invalid Images')
    return res.redirect("/add-product")
  };
  
  file.mv(`./assets/${fileName}`, async (err) => {
      if(err) return res.status(500).json({msg:err.message})
      try {
        const namaBarang = req.body.nama_barang
        const kodeBarang = 'BRG-' + Date.now()
        const jenis = req.body.jenis
        const harga = req.body.harga
        const quantitas = req.body.quantitas
        const deskripsi = req.body.deskripsi

        const sql = `INSERT INTO tb_barang (id, kode_barang, nama_barang, jenis, quantitas, harga, gambar,deskripsi) VALUES (NULL, '${kodeBarang}', '${namaBarang}', '${jenis}', ${quantitas}, ${harga}, '${fileName}', '${deskripsi}');`
        db.query(sql,(err,result) => {
            if(err)throw err;
        })
        
          res.redirect("/add-product")
      } catch (error) {
          console.log(error.message);
      }
  })

}


export const updateProductDashboard =  (req,res) => {
  const kodeBarang = req.body.kode_barang
  const sql = `SELECT * FROM tb_barang WHERE kode_barang = '${kodeBarang}'`
  db.query(sql,(err,result)=> {
    if(err) throw err;
    const product = JSON.parse(JSON.stringify(result, null, 2));
    let fileName = "";
    if(req.files === null){
      fileName = product[0].gambar
  } else {
    const file = req.files.asset
    const ext = path.extname(file.name)
    fileName = file.md5 + ext ;
    const allowedType = [".png",".jpg",".jpeg"]
    //Validasi Type extension
    if(!allowedType.includes(ext.toLowerCase())){
      req.flash('msg','Invalid Images')
      const barang = product
      return res.render("edit-product.ejs",
      { barang,msg:req.flash('msg')});
    };
      // Delete Image Lama
      const filePath = `./assets/${product[0].gambar}`
      fs.unlinkSync(filePath) 
      file.mv(`./assets/${fileName}`,  (err) => {
        if(err) return res.status(500).json({msg:err.message})
    })   
  }

  const namaBarang = req.body.nama_barang
  const jenis = req.body.jenis
  const harga = req.body.harga
  const quantitas = req.body.quantitas
  const all = req.body
  const id = req.body.id

  const sqlUpdate = `UPDATE tb_barang SET kode_barang = '${kodeBarang}', nama_barang = '${namaBarang}', jenis = '${jenis}', quantitas = '${quantitas}', harga = '${harga}', gambar = '${fileName}' WHERE tb_barang.id = ${id};`

  db.query(sqlUpdate,(err,result) => {
    if(err)throw err;
    res.redirect("/dashboard")
  })

  })


}


export const deleteProductDashboard = (req,res) => {
    const kodeBarang = req.params.kode_barang
   
    const gambar = req.body.gambar
    console.log(gambar);
    fs.unlinkSync(`./assets/${gambar}`)
    const sql = `DELETE FROM tb_barang WHERE tb_barang.kode_barang = '${kodeBarang}'`
    db.query(sql,(err,result) => {
        if(err)throw err;
        res.redirect("/dashboard")
    })
}


export const updateProduct =  (req,res) => {
  const sql = `SELECT * FROM tb_barang WHERE kode_barang = '${req.params.kode_barang}'`
  db.query(sql,(err,result)=> {
    if(err) throw err;
    const barang = JSON.parse(JSON.stringify(result, null, 2));
    if(!barang) {
      req.flash('msg','PRODUCT NOT FOUND')
      return res.redirect("/add-product")
    }
 
    res.render("edit-product.ejs",{barang,msg:req.flash('msg')})
  })
  

}