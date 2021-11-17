const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProductSchema = new Schema({
	name: String,
	price: Number,
	category: String,
	status: Number,
	image: String,
	description: String
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;

module.exports.createProduct = (newProduct, callback) => {
	const productData = new Product(newProduct);
	productData.save(callback);
}