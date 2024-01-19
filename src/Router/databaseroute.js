const express = require('express')

const router = express.Router()
const mongoose = require('mongoose')

router.get('/databases', async (req, res) => {
	try {
		const databasesList = await mongoose.connection.db.admin().listDatabases()
		const databaseData = {}

		// Generate HTML for the dropdown
		let html = '<html><head><title>MongoDB Data</title></head><body>'
		html += '<h1>MongoDB Data</h1>'
		html += '<form action="/databases" method="get">'
		html += '<label for="database">Select Database:</label>'
		html += '<select name="database" id="database" onchange="this.form.submit()">'
		html += '<option value="" selected disabled hidden>Select Database</option>'

		for (const db of databasesList.databases) {
			const dbName = db.name
			html += `<option value="${dbName}">${dbName}</option>`
		}

		html += '</select>'
		html += '</form>'

		// Handle the GET request to /databases
		const selectedDatabase = req.query.database

		if (selectedDatabase) {
			// Continue with your existing code to fetch collections and data
			const newConnection = mongoose.connection.useDb(selectedDatabase)
			const collections = await newConnection.db.listCollections().toArray()
			const collectionData = {}

			for (const collection of collections) {
				const collectionName = collection.name

				const documents = await newConnection.collection(collectionName).find({}).toArray()
				collectionData[collectionName] = documents
			}

			databaseData[selectedDatabase] = collectionData

			html += '<h2>Database Collections and Data</h2>'
			// Display the fetched data or collections as needed
			// ...

			html += `<pre>${JSON.stringify(databaseData, null, 2)}</pre>`
		}

		html += '</body></html>'
		res.send(html)
	} catch (error) {
		console.error('Error fetching database data:', error.message)
		res.status(500).send('Internal Server Error')
	}
})
module.exports = router
