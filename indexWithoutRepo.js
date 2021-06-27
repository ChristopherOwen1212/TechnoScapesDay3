// import library
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

// inisialisasi app 
const app = express();
app.use(bodyParser.json());

// inisialisasi port
app.listen('3000', () => {
    console.log('App listening at https://localhost:3000')
})

// REQUEST => client minta data
// RESPONSE => server balikin data

app.get('/', (req, res) => {
    // Content Type JSON
    const data = { message: 'API Tokopaedi' }
    res.json(data)
})

// HTTP GET
// buat get list products
app.get('/products', async (req, res) => {
    const queryString = req.query;
    
    const productsBuffer = await fs.readFile('database/products.json');
    const products = JSON.parse(productsBuffer);

    // bikin logic filter
    // js filter --> return false maka data dibuang, kalo true akan tetep diarray
    const searchResult = products.filter((product) => {
        if(!queryString.search){
            return true;
        }

        return product.name.toLowerCase() === queryString.search;
    })

    // logic cek kalo ga ketemu / kalo data kosong
    if(searchResult.length === 0) {
        res.sendStatus(404);
    }
    else{
        res.json(searchResult);
    }
})

// buat get product detail
app.get('/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    const productsBuffer = await fs.readFile('database/products.json');
    const products = JSON.parse(productsBuffer);

    const productDetail = products.filter(product => product.id === id)[0];

    if (!productDetail) {
        return res.sendStatus(404);
    }

    res.json({ product: productDetail })
})

// HTTP POST
// buat insert data product ke products.json
app.post('/products', async (req, res) => {
    if (!req.body.name || !req.body.price) {
        // validasi kalo param yang dikirim ga bener
        return res.sendStatus(400);
    }

    // Process insert data:
    // 1. Baca data json saat ini
    const productsBuffer = await fs.readFile('database/products.json');
    const products = JSON.parse(productsBuffer);

    // insert data product
    const newProductData = {
        // baca data request
        id: req.body.id,
        name: req.body.name, 
        price: req.body.price
    };

    // 2. Insert ke array
    products.push(newProductData);

    // 3. timpa file json dengan array yang baru
    await fs.writeFile('database/products.json', JSON.stringify(products, null, 2));

    res.json({ 
        message: 'success'
    })
})

// HTTP PUT
// Buat update
app.put('/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    const newData = req.body;
    const productsBuffer = await fs.readFile('database/products.json');
    const products = JSON.parse(productsBuffer);

    // map ==> buat ubah dari 1 array ke bentuk lainnya
    const afterUpdateProducts = products.map((product) => {
        if (product.id === id) {
            // product ini yang mau di update
            // timpa semua data yang ada dengan new data
            return {
                id: product.id,
                name: newData.name,
                price: newData.price
            }
        }
        else {
            return product;
        }
    })
    
    // timpa db dengan var baru
    await fs.writeFile('database/products.json', JSON.stringify(afterUpdateProducts, null, 2));

    res.json({ 
        message: 'success'
    })
})

// HTTP DELETE
// hapus data
app.delete('/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    const productsBuffer = await fs.readFile('database/products.json');
    const products = JSON.parse(productsBuffer);

    // map ==> buat ubah dari 1 array ke bentuk lainnya
    const afterDeleteProduct = products.filter((product) => {
        if (product.id === id) {
            // product ini yang mau dihapus
            return false
        }
        else {
            return true;
        }
    })
    
    // timpa db dengan var baru
    await fs.writeFile('database/products.json', JSON.stringify(afterDeleteProduct, null, 2));

    res.json({ 
        message: 'success'
    })
})