const mongoose = require('mongoose')

console.log(process.env.MONGODB_CONNECTION_URL)

try {
	mongoose
		.connect(process.env.MONGODB_CONNECTION_URL)
		.then(() => console.log('Established connection to database'))
} catch (e) {
	console.log('Connection to database failed')
}
