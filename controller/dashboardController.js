import db from "../config/Database.js";
import ejs from "ejs";
import multer from "multer";
import fs from "fs";
import path from "path";
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
    res.render("add.ejs");
  } catch (error) {
    console.log(error.message);
  }
};

export const saveProductDashboard = (req, res) => {
  try {
    const namaBarang = req.body.nama_barang;
    const kodeBarang = req.body.kode_barang;
    const jenis = req.body.jenis;
    const harga = req.body.harga;
    const quantitas = req.body.quantitas;
    const deskripsi = req.body.deskripsi;
    const namaFile = req.file.filename;
    const allowedType = [".png",".jpg",".jpeg"]
    
    const ext = path.extname(namaFile)
    
    if(!allowedType.includes(ext.toLowerCase())){
        req.flash('msg','Invalid Images') 
       return res.status(422).redirect("/add-product")
    } else {
        const sql = `INSERT INTO tb_barang (id, kode_barang, nama_barang, jenis, quantitas, harga, gambar,deskripsi) VALUES (NULL, '${kodeBarang}', '${namaBarang}', '${jenis}', ${quantitas}, ${harga}, '${namaFile}', '${deskripsi}');`;
        db.query(sql, (err, result) => {
          if (err) throw err;
          res.redirect("/add-product");
        });
    }
  } catch (error) {
    console.log(error.message);
  }
};

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


export const savekw2Product = (req,res) => {
  if(req.files === null) return res.json({msg:"No File Uploaded"});
    const name = req.body.title
    const file = req.files.file // name di input nya file !!!
    const fileSize = file.data.length;
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext ;
    const url = `${req.protocol}://${req.get("host")}/image/${fileName}`
    const allowedType = [".png",".jpg",".jpeg"]

    if(!allowedType.includes(ext.toLowerCase())) return res.json({msg:"Invalid Image"}) ;

    file.mv(`./public/image/${fileName}`, async (err) => {
        if(err) return res.status(500).json({msg:err.message})
        // try {
        //    await Product.create({
        //         nama:name,
        //         image:fileName,
        //         url:url
        //     })
        //     res.status(201).json({msg:"Product Succesed Created"})
        // } catch (error) {
        //     console.log(error.message);
        // }
    })

  // file.mv(`./assets/${fileName}`, async (err) => {
  //   if(err) return res.status(500).json({msg:err.message})

  //   try {
  //     // const sql = `INSERT INTO tb_barang (id, kode_barang, nama_barang, jenis, quantitas, harga, gambar,deskripsi) VALUES (NULL, 'BRG${Date.now()}', ' ${name}', 'Makanan', 1000, 1500, '${fileName}', 'hfeweujhhiuheiwfjodskjoidsjod);`;
  //     // db.query(sql,(el,result) => {
  //     //   if(el) throw el ;
  //     //   res.status(200).json(result)
  //     // })
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // })
}
