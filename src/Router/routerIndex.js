const express = require('express')

const router = express.Router()
let calls = require('./calls')
const { getPaymentLink, stripeWebhookHandler, phonepeWebhookHandler } = require('../Payment/index')
let databaseroute = require('./databaseroute')
/** stripe needs raw headers that's why its place above express.json() */
router.use(express.json())
router.use(express.urlencoded({ extended: false }))
router.use('/calls', calls)
router.use('/', databaseroute)
router.post('/getPaymentLink', getPaymentLink)
router.post('/stripePayment', async (req, res) => {
	try {
		await stripeWebhookHandler(req, res)
	} catch (err) {
		console.error('Error handling webhook:', err.message)
		res.status(500).send('Webhook Error')
	}
}) 

router.post('/phonepePayment/:userId', async (req, res) => {
	try { 
		await phonepeWebhookHandler(req, res)
	} catch (err) {
		console.error('Error handling webhook:', err.message)
		res.status(500).send('Webhook Error')
	}
})
module.exports = router
