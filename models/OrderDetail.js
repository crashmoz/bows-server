const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DetailSchema = new Schema({
	name: String,
	quantity: Number,
	price: Number,
	order_id: String,
});