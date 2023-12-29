const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()
let calls = require('./calls')
const { getPaymentLink, stripeWebhookHandler } = require('../Payment/index')

/** stripe needs raw headers that's why its place above express.json() */
router.post('/stripePayment', bodyParser.raw({ type: 'application/json' }), stripeWebhookHandler)

router.use(express.json())
router.use(express.urlencoded({ extended: false }))
router.use('/calls', calls)
router.post('/getPaymentLink', getPaymentLink)
module.exports = router
