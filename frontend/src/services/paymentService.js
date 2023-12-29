import serverUrl from '../config'
async function getPaymentLink(amount, userId) {
	try {
		const response = await fetch(
			`${serverUrl}/getPaymentLink?amount=${amount}&userId=${userId}`
		)
		if (response.ok) { 
			const data = await response.json()
			console.log('data: ', data)
			return data
		} else {
			console.log('Request failed with status:', response.status)
			new Error('Request failed with status:', response.status)
			return null
		}
	} catch (e) {
		console.log(e)
		new Error('Request failed', e)
		return null
	}
}

export { getPaymentLink }
