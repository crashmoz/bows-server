const Category = require('../models/Category')

module.exports.controller = (app, io) => {
    app.get('/categories', (req, res) => {
        Category.find({}, (err, data) => {
            if (err) {
                res.send(err)
            } else {
                res.send({ data })
            }
        })
    })

    app.post('/categories', (req, res) => {
        Category.createCategory(req.body, (err, data) => {
            if (err) {
                res.status(422).json({ message: err })
            } else {
                res.status(200).send({ data })
            }
        })
        // console.log(req.body);
        // res.status(200).send({ message: "ok" })
    })
}