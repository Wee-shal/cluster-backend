const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()
let calls = require('./calls')
const { getPaymentLink, stripeWebhookHandler } = require('../Payment/index')

/** stripe needs raw headers that's why its place above express.json() */
router.use(express.json())
router.use(express.urlencoded({ extended: false }))
router.use('/calls', calls)
router.post('/getPaymentLink', getPaymentLink)
router.post('/stripePayment', async (req, res) => {
	try { 
		await stripeWebhookHandler(req, res)
	} catch (err) {
		console.error('Error handling webhook:', err.message)
		res.status(500).send('Webhook Error')
	}
})
module.exports = router
