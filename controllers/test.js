const Test = require("../models/Test");

module.exports.controller = (app, io) => {
	// io.on('connection', function(socket) {
 //        console.log('connected!');
 //    })
	app.post("/test", (req, res) => {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, "0");
		var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
		var yyyy = today.getFullYear();
		let number = "001";
		const date = dd + mm + yyyy
		const id = "TRX-" + date + "-" + number;

		const newData = new Test({
			_id: id,
			desc: "Description",
		});

		Test.createData(newData, (err, data) => {
			if (err) {
				res.status(422).res.json({ message: err });
			} else {
				res.status(200).send({data});
			}
		});
	});

	app.get('/tf', async (req, res) => {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, "0");
		var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
		var yyyy = today.getFullYear();
		const date = dd + mm + yyyy
		const id = date

		var insertId = await generatetId(id)
		res.send(insertId)
		// const newData = new Test({
		// 	_id: insertId,
		// 	desc: "Description"
		// })

		// Test.createData(newData, (err, data) => {
		// 	if (err) {
		// 		res.status(422).res.json({ message: err })
		// 	} else {
		// 		res.status(200).send({ data })
		// 	}
		// })
	})

	async function generatetId(param) {
		const data = await Test.findById({$regex: '.*' + param + '.*' }).sort({_id:-1}).limit(1)

		if (data) {
			let id = data._id
			const number = id.substr(13, 3)
			const n = parseInt(number) + 1
			var string_number = String(n)
			let code = id.substr(0, 13)
			var code_number = n.padStart(3, '0')
			return code_number
			// if (string_number.length === 1) {
			// 	code_number = '00'+string_number
			// } else if (string_number === 2) {
			// 	code_number = '0'+string_number
			// } else {
			// 	code_number = string_number
			// }
			// return code+code_number	
		} else {
			return 'TRX-'+param+'-001'
		}
	}

	app.get('/test', (req, res) => {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, "0");
		var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
		var yyyy = today.getFullYear();
		const date = dd + mm + yyyy
		// var id

		Test.find({_id: {$regex: '.*' + date + '.*' }}, (err, data) => {
			let id = data[0]._id
			const number = id.substr(13, 3)
			const n = parseInt(number) + 1
			var string_number = String(n)
			let kode = id.substr(0, 13)
			var code_number = ''
			// let kodeId = $kode . sprintf("%03s", string_number);
			if (string_number.length === 1) {
				code_number = '00'+string_number
			} else if (string_number === 2) {
				code_number = '0'+string_number
			} else {
				code_number = string_number
			}
			res.send(code_number)
		}).sort({_id:-1}).limit(1)
	})

	app.get('/test_socket', (req, res) => {
		io.emit('new message', 'test')
		res.status(200).send({ message: 'ok' })
	})
};
