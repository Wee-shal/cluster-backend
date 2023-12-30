const { Double } = require('mongodb')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	userId: String,
	name: String,
	isHelper: Boolean,
	profilePic: String,
	description: String,
	skills: {
		type: Array,
		default: [],
	},
	avgRatings: {
		type: mongoose.Schema.Types.Decimal128,
		min: 0,
		max: 5,
	},
	country: String,
	reviews: {
		type: Map,
		of: new mongoose.Schema({
			username: String,
			country: String,
			ratings: mongoose.Schema.Types.Decimal128,
			postDate: {
				type: Date,
				default: Date.now(),
			},
		}), 
	},
	registrationDate: {
		type: Date,
		default: Date.now(), 
	},
	balance: Number,
	currency: String,
	phoneNumber: String,
	rates: Number,
})

module.exports = mongoose.model('User', userSchema)
