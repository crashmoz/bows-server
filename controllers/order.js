const OrderSchema = require("../models/Order");

module.exports.controller = (app, io) => {
	app.post("/order", async (req, res) => {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, "0");
		var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
		var yyyy = today.getFullYear();
		const dateToday = yyyy + '-' + mm + '-' + dd
		const date = dd + mm + yyyy
		const time = today.getHours() + ':' + String(today.getMinutes() + 1).padStart(2, '0')

		const insertId = await generatetId(date)

		const newOrder = new OrderSchema({
			_id: insertId,
			status: 'PENDING',
			order_type: req.body.orderType,
			payment_type: req.body.paymentType,
			wallet: req.body.wallet,
			payment_status: 'PENDING',
			total_amount: req.body.totalPrice,
			total_items: req.body.totalQty,
			product: req.body.product,
			date: dateToday,
			time: time
		});

		OrderSchema.createOrder(newOrder, (err, order) => {
			if (err) {
				res.status(422).res.json({ message : err });
			} else {
				io.emit('order added', order)
				res.status(200).send({ order });
			}
		});
	});

	app.get("/orders", (req, res) => {
		OrderSchema.find({}, (err, data) => {
			if (err) {
				res.send(err);
			} else {
				res.send({ data });
			}
		});
	});

	async function generatetId(param) {
		const data = await OrderSchema.findById({$regex: '.*' + param + '.*' }).sort({_id:-1}).limit(1)

		if (data) {
			let id = data._id
			const number = id.substr(13, 3)
			const n = parseInt(number) + 1
			var string_number = String(n)
			let code = id.substr(0, 13)
			var code_number = string_number.padStart(3, '0')
			return code+code_number	
		} else {
			return 'TRX-'+param+'-001'
		}
	}

	app.get('/order/:id', (req, res) => {
		OrderSchema.findById(req.params.id, (err, data) => {
			if (err) { res.send(err) }
			res.send(data)
		})
	})

	app.get('/order_today', (req, res) => {
		const dates = new Date()
		const today = String(dates.getFullYear()) +
				"-" +
				String(dates.getMonth() + 1).padStart(2, "0") +
				"-" +
				String(dates.getDate()).padStart(2, "0");
		OrderSchema.find({date: today}, (err, data) => {
			if (err) { res.send(err) }
			res.send(data)
		})
	})

	app.post('/changeStat_order', (req, res) => {
		OrderSchema.findByIdAndUpdate(req.body._id, { status : req.body.status })
		.then(() => {
			console.log(req.body)
			io.emit("update status", req.body)
			res.status(200).send({ message: 'success' })
		}).catch((err) => {
			res.send(err)
		})
		// const data = req.body
		// io.emit("update status", data)
		// res.status(200).send({message: 'success'})
	})
};
