const fs = require("fs")


const dirPath = "./data"
if(!fs.existsSync(dirPath)){
    fs.mkdirSync("data")
}



const dataPath = "./data/checkout.json"
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '{"cart":[] }', "utf-8")
}

const findCart = (kode) => {
  const carts = loadCart();
  const carikode = carts.cart.find(
    (cart) => cart.kode_barang.toLowerCase() === kode.toLowerCase()
  );
  return carikode;
}

const loadCart = () => {
    const file = fs.readFileSync("data/checkout.json", "utf-8");
    const cart = JSON.parse(file);
    return cart;
  };

  const saveCarts = (carts) => {
    fs.writeFileSync("data/checkout.json", JSON.stringify(carts, null, 2));
  }

const addCart = (cart) => {
    const carts = loadCart()
    carts.cart.push(cart)
    saveCarts(carts);
}

const deleteCart = (inv) => {
  const carts = loadCart()
  const filterCarts = carts.cart.filter((keranjang) => keranjang.inv !== inv)
  const filtered = JSON.stringify(filterCarts,null,2)
  fs.writeFileSync("data/checkout.json", `{"cart":${filtered} }`);
  
}


module.exports={loadCart,saveCarts,addCart,findCart,deleteCart}