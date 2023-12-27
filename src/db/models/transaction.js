const mongoose = require('mongoose')
const User = require('./users')

const transactionSchema = new mongoose.Schema({
	transactid: String,
	timeStamp: String,
	caller: {type: String, ref:User},
	helper:{type:String,ref:User},
	duration: String,
	rate: Number,
	amount: String,
})

module.exports = mongoose.model('Transaction', transactionSchema)
