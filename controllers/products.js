const ProductSchema = require("../models/Product");
const multer = require("multer");
const fs = require("fs");
const { pathToFileURL } = require("url");
const path = require("path");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/product/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
var upload = multer({ storage: storage });

module.exports.controller = (app) => {
  // fetch all products
  app.get("/products", (req, res) => {
    ProductSchema.find({}, (err, products) => {
      if (err) {
        res.send(err);
      } else {
        res.send({ products });
      }
    });
  });
  // fetch image
  app.get("/prodImg/:name", (req, res) => {
    const name = req.params.name;
    res.sendFile("./images/product/" + name, { root: "." });
  });

  // save data
  app.post("/products", upload.single("image"), (req, res) => {
    const newProduct = new ProductSchema({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      image: req.file.filename,
    });
    
    ProductSchema.createProduct(newProduct, (err, product) => {
      if (err) {
        res.status(422).json({ message: err });
      } else {
        res.status(200).send({ product });
      }
    });
  });

  // update data
  app.put('/products', upload.single('image'), (req, res) => {
  	let dataImage = '';
  	if (req.file) {
  		dataImage = req.file.filename;
  	} else {
  		dataImage = req.body.image;
  	}

  	const product = {
  		name: req.body.name,
  		price: req.body.price,
  		category: req.body.category,
  		description: req.body.description,
  		image: dataImage,
  	};

  	ProductSchema.findByIdAndUpdate(req.body._id, product)
  	.then(() => {
  		res.send(product);
  	})
  	.catch((err) => {
  		if (err.kind === 'ObjectId') {
  			return res.status(404).send({
  				message: 'Product not found with id ' + req.body._id,
  			});
  		}
  		res.status(500).send({
          message: "Error updating product with id " + req.body._id,
        });
  	});
  }); 

  // delete data
  app.delete("/products/:id", (req, res) => {
    const id = req.params.id;
    ProductSchema.findByIdAndDelete(id, (err, val) => {
      const imgpath = path.resolve("./images/product/" + val.image + ".jpg");
      if (err) {
        res.status(422).json({
          message: "failed delete data",
        });
      } else {
        // delete image
        fs.unlink("./images/product/" + val.image, (err) => {
          if (err) {
            res.status(422).json({
              message: err,
            });
          } else {
            res.status(200).json({
              message: "Successful deleted data .",
            });
          }
        });
      }
    });
  });
};
