const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TestSchema = new Schema({
	_id: String,
	desc: String,
});

const Test = mongoose.model("Test", TestSchema);
module.exports = Test;

module.exports.createData = (newData, callback) => {
	const testData = new Test(newData);
	testData.save(callback);
};

module.exports.searchIdToday = (date, callback) => {
	const query = { $regex: '.*' + date + '.*' }
	Test.findById(query, callback)
}
