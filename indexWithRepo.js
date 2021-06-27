// REPOSITORY PATTERN --> pemisahan code menjadi:
// 1. BUSINESS LOGIC
// 2. PERSISTENCE LAYER = simpen database!


// import library
const express = require('express');
const bodyParser = require('body-parser');

const ProductRepository = require('./productRepository');

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
    const allProducts = await ProductRepository.findAll();
    return res.json(allProducts);
})

// buat get product detail
app.get('/products/:id', async (req, res) => {
    const productDetail = await ProductRepository.findOne(req.params.id);
    return res.json(productDetail);
})

// HTTP POST
// buat insert data product ke products.json
app.post('/products', async (req, res) => {
    await ProductRepository.insert(req.body);
    return res.json({ message: 'Success'});
})

// HTTP PUT
// Buat update
app.put('/products/:id', async (req, res) => {
    await ProductRepository.update(req.params.id, req.body);
    return res.json({ message: 'Success'});
})

// HTTP DELETE
// hapus data
app.delete('/products/:id', async (req, res) => {
    await ProductRepository.delete(req.params.id);
    return res.json({ message: 'Success'});
})