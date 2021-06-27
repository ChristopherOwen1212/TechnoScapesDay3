// ProductRepository adalah function untuk abstraksi 
// / kumpulan logic yang berhubungan dengan DB
const fs = require('fs').promises;
const uuidv4 = require('uuid').v4;

const ProductRepository = {
    findAll: async() => {
        // logic untuk baca dari DB
        const productsBuffer = await fs.readFile('database/products.json');
        const products = JSON.parse(productsBuffer);
        return products;
    },
    findOne: async(id) => {
        const productsBuffer = await fs.readFile('database/products.json');
        const products = JSON.parse(productsBuffer);
        const productDetail = products.filter(product => product.id === id)[0];
        return productDetail;
    },
    insert: async (newProduct) => {
        // logic untuk write ke DB
        const newProductData = {
            id: uuidv4(),
            name: newProduct.name,
            price: newProduct.price
        };
        const currentProducts = await ProductRepository.findAll();
        currentProducts.push(newProductData);
        await ProductRepository.write(currentProducts);
        return true;
    },
    update: async(id, updatedProduct) => {
        const currentProducts = await ProductRepository.findAll();
        updatedProduct = currentProducts.map((product) => {
            if (product.id === id) {
                return {
                    id: product.id,
                    name: updatedProduct.name,
                    price: updatedProduct.price,
                }
            }
            else {
                return product;
            }
        })
        await ProductRepository.write(updatedProduct);
        return true;
    },
    delete: async(productToDeleteId) => {
        const currentProducts = await ProductRepository.findAll();
        const productAlreadyDeleted = currentProducts.filter((product) => {
            return product.id !== productToDeleteId;
        })
        await ProductRepository.write(productAlreadyDeleted);
        return true;
    },
    write: async (products) =>{
        await fs.writeFile('database/products.json', JSON.stringify(products, null, 2));
        return true;
    }
};

module.exports = ProductRepository;