const Order = require("../models/Order");
// const doc = new PDFDocument();

module.exports.controller = (app) => {
	app.get("/transaction_report", (req, res) => {
		Order.find({}, (err, data) => {
			if (err) {
				res.send(err);
			} else {
				res.send({ data });
			}
		});
	});

	app.post("/test_report", (req, res) => {
		let end = "";
		if (req.body.end) {
			end = req.body.end;
		} else {
			var today = new Date();
			end =
				today.getFullYear +
				"-" +
				String(today.getMonth() + 1).padStart(2, "0") +
				"-" +
				String(today.getDate()).padStart(2, "0");
		}
		Order.find(
			{
				date: {
					$gte: req.body.start,
					$lte: end,
				},
			},
			(err, data) => {
				if (err) {
					res.send(err);
				} else {
					res.send(data);
				}
			}
		);
	});
};
