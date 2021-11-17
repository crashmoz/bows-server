const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Categories = new Schema({
    name: String,
})

const Category = mongoose.model('Category', Categories)
module.exports = Category

module.exports.createCategory = (newCategory, callback) => {
    const categoryData = new Category(newCategory)
    categoryData.save(callback)
}