const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const axios = require('axios')
const crypto = require('crypto')
const User = require('../db/models/users')
const Transaction = require('../db/models/transaction')

async function getPaymentLink(amount, userId) {
	try {
		const user = await User.findOne({ userId })
		let currency = user?.phoneNumber.startsWith('+91') ? 'INR' : 'USD'
		if (currency === 'USD') {
			const price = await stripe.prices.create({
				unit_amount: amount * 100,
				currency,
				product_data: {
					name: 'Credits',
				},
			})
			if (user?.country) {
				const session = await stripe.checkout.sessions.create({
					payment_method_types: ['card'],

					line_items: [
						{
							price: price.id,
							quantity: 1,
						},
					],
					metadata: {
						user_id: JSON.stringify({
							userId,
						}),
					},
					mode: 'payment',
					success_url: `${process.env.BASE_URL}/success.html`,
				})

				return session.url
			}
		} else {
			const customer = await stripe.customers.create({
				name: user.name,
				address: {
					city: 'New york',
					country: 'US',
					line1: 'dfdfsad',
					line2: 'dfee',
					postal_code: '12345',
				},
			})
			console.log(customer)
			const price = await stripe.prices.create({
				unit_amount: amount * 100,
				currency,
				product_data: {
					name: 'Credits',
				},
			})
			if (user?.country) {
				const session = await stripe.checkout.sessions.create({
					payment_method_types: ['card'],
					customer: customer.id,
					line_items: [
						{
							price: price.id,
							quantity: 1,
						},
					],
					metadata: {
						user_id: JSON.stringify({
							userId,
						}),
					},
					mode: 'payment',
					success_url: `${process.env.BASE_URL}/success.html`,
				})

				return session.url
			}
		}
		// } else {
		// 	try {
		// 		const merchantTransactionId = `M${Date.now()}`
		// 		const phone = user.phoneNumber
		// 		const { name } = user
		// 		const data = {
		// 			merchantId: process.env.MERCHANT_ID,
		// 			merchantTransactionId,
		// 			merchantUserId: `MUID${userId}`,
		// 			name,
		// 			amount: amount * 100,
		// 			redirectUrl: `${process.env.BASE_URL}/success.html`,
		// 			redirectMode: 'REDIRECT',
		// 			callbackUrl: `${process.env.CALLBACK_URL}/phonepePayment/${userId}`,
		// 			mobileNumber: phone,
		// 			paymentInstrument: {
		// 				type: 'PAY_PAGE',
		// 			},
		// 		}
		// 		const payload = JSON.stringify(data)
		// 		const payloadMain = Buffer.from(payload).toString('base64')
		// 		const keyIndex = 1
		// 		const string = `${payloadMain}/pg/v1/pay${process.env.SALT_KEY}`
		// 		const sha256 = crypto.createHash('sha256').update(string).digest('hex')
		// 		const checksum = `${sha256}###${keyIndex}`
		// 		const prodURL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
		// 		const options = {
		// 			method: 'POST',
		// 			url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
		// 			headers: {
		// 				accept: 'application/json',
		// 				'Content-Type': 'application/json',
		// 				'X-VERIFY': checksum,
		// 			},
		// 			data: {
		// 				request: payloadMain,
		// 			},
		// 		}
		// 		const response = await axios.request(options)

		// 		// Redirect the user to the PhonePe payment page
		// 		return response.data.data.instrumentResponse.redirectInfo.url
		// 	} catch (e) {
		// 		console.log(e)
		// 	}
		// }
	} catch (e) {
		if (e.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			console.log('Error status:', e.response.status)
			console.log('Error data:', e.response.data)
			console.log('Error headers:', e.response.headers)
		} else if (e.request) {
			// The request was made but no response was received
			console.log('No response received')
			console.log('Request:', e.request)
		} else {
			// Something happened in setting up the request that triggered an Error
			console.log('Error message:', e.message)
		}
		console.log('Error config:', e.config)
		return null
	}
}

// eslint-disable-next-line consistent-return
async function stripeWebhookHandler(request, response) {
	console.log('stripeWebhookHandler hit...')
	try {
		let data
		let eventType
		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
		if (webhookSecret) {
			data = request.body.data
			eventType = request.body.type
		}
		console.log(eventType)
		switch (eventType) {
			case 'customer.created':
				// console.log(data)
				break
			case 'charge.succeeded':
				//	console.log('customer payment ID: ', data?.object?.id)
				break
			case 'checkout.session.completed':
				// eslint-disable-next-line no-case-declarations
				const sessionId = data.object.id
				// eslint-disable-next-line no-case-declarations
				const retrievedSession = await stripe.checkout.sessions.retrieve(sessionId)
				// eslint-disable-next-line no-case-declarations
				console.log(
					'retrievedSession.metadata.user_id: ',
					retrievedSession.metadata.user_id
				)
				// eslint-disable-next-line no-case-declarations
				const { userId } = JSON.parse(retrievedSession.metadata.user_id)
				console.log('userId: ', userId)
				console.log(retrievedSession.amount_total)
				try {
					const result = await User.updateOne(
						{ userId },
						{
							$inc: {
								balance: parseInt(retrievedSession.amount_total / 100, 10),
							},
						}
					)
					const user = await User.findOne({ userId })
					const timeStamp = new Date(parseInt(data.object.created, 10) * 1000)
					console.log('result', result)
					// Create the formatted date string
					const transact = new Transaction({
						transactid: data.object.balance_transaction,
						timeStamp,
						caller: userId,
						amount: parseFloat(retrievedSession.amount_total / 100, 10),
						isRecharge: true,
						balance: user.balance,
					})
					transact.save()
					if (result.modifiedCount === 1) {
						console.log(
							`Balance: ${parseInt(
								retrievedSession.amount_total / 100,
								10
							)} is saved for userId: ${userId}`
						)
					} else {
						console.log('Failed to update the balance for userId: ', userId)
					}
				} catch (e) {
					console.log(e)
				}

				console.log('checkout.session.completed')
				break
			case 'invoice.paid':
				console.log('invoice.paid')
				break
			case 'invoice.payment_failed':
				console.log('invoice.payment_failed')
				break
			case 'charge.refunded.update':
				console.log('charge.refunded.update')
				break
			default:
				console.log('default')
		}

		response.sendStatus(200)
	} catch (e) {
		console.log(e)
	}
}

// eslint-disable-next-line no-unused-vars
// async function phonepeWebhookHandler(req, res) {
// 	console.log('/phonepeWebhookHandler hit...')
// 	const decodedResponse = Buffer.from(req?.body?.response, 'base64').toString('utf-8')
// 	const { userId } = req.params
// 	const response = JSON.parse(decodedResponse)
// 	console.log(response)
// 	if (response.success) {
// 		try {
// 			const result = await User.updateOne(
// 				{ userId },
// 				{ $inc: { balance: parseInt(response?.data?.amount / 100, 10) } }
// 			)
// 			const user = await User.findOne({ userId })
// 			const timeStamp = new Date()
// 			const transact = new Transaction({
// 				transactid: response?.data?.transactionId,
// 				timeStamp,
// 				caller: userId,
// 				amount: parseFloat(response?.data?.amount / 100, 10),
// 				isRecharge: true,
// 				balance: user.balance,
// 			})
// 			transact.save()

// 			if (result.modifiedCount === 1) {
// 				console.log(`Balance: ${response?.data?.amount} is saved for userId: ${userId}`)
// 			} else {
// 				console.log('Failed to update the balance for userId: ', userId)
// 			}
// 		} catch (e) {
// 			console.log('error', e)
// 		}
// 	}
// }

module.exports = {
	stripeWebhookHandler,
	getPaymentLink,
}
