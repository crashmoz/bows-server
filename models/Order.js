const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const OrderSchema = new Schema({
	_id: {
		type: String,
      	minlength: 16,
      	maxlength: 16,
      	trim: true,
      	required: true
	},
	order_type: {
		type: String,
		enum: ["DINE IN", "TAKE AWAY"],
	},
	total_amount: Number,
	total_items: Number,
	product: [],
	payment_status: {
		type: String,
		enum: ["PENDING", "PAID"],
	},
	payment_type: {
		type: String,
		enum: ["CASH", "QR CODE"],
	},
	wallet: {
		type: String,
		enum: ["GOPAY", "OVO", "DANA"]
	},
	status: {
		type: String,
		enum: ["PENDING", "DONE"],
	},
	date: String,
	time: String,
	// date: {type: Date, default: Date.now},
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;

module.exports.createOrder = (newOrder, callback) => {
	const orderData = new Order(newOrder);
	orderData.save(callback);
};