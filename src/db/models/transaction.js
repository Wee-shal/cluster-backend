const mongoose = require('mongoose')
const User = require('./users')

const transactionSchema = new mongoose.Schema({
	transactid: String,
	timeStamp: Date,
	caller: { type: String, ref: User },
	helper: { type: String, ref: User },
	duration: Number,
	rate: Number,
	amount: Number,
	isRecharge: Boolean,
})

module.exports = mongoose.model('Transaction', transactionSchema)
