import { useState, useEffect } from 'react'
import serverUrl from '../src/config'

const TableComponent = () => {
	const [data, setData] = useState([])
	const [callerName, setCallerName] = useState(null)
	useEffect(() => {
		(async () => {
			fetch(`${serverUrl}/data`)
				.then(response => response.json())
				.then(data => setData(data))
				.catch(error => console.error('Error fetching data:', error))
		})()
	}, [])
	const formatAmount = amount => {
		return `$ ${amount.toFixed(2)}`
	}
	const formatDuration = seconds => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}m ${remainingSeconds}s`
	}
	return (
		<div style={{ textAlign: 'center', overflowX: 'auto' }}>
			<table style={{ margin: '0 auto', ...tableStyle }}>
				<thead>
					<tr>
						<th style={thStyle}>From</th>
						<th style={thStyle}>To</th>
						<th style={thStyle}>Call duration</th>
						<th style={thStyle}>Rate/min</th>
						<th style={thStyle}>Amount</th>
					</tr>
				</thead>
				<tbody>
					{/*Dynamic table rows*/}
					{data.map(item => (
						<tr key={item?._id.toString()}>
							<td style={tdStyle}>{item.caller}</td>
							<td style={tdStyle}>
								{item.helper ? (

										`${item.helper}`
								) : (
									'Recharged'
								)}
							</td>
							<td style={tdStyle}>
								{item?.duration ? formatDuration(item?.duration) : '-'}
							</td>
							<td style={tdStyle}>{item?.rate ? item.rate : '-'}</td>
							<td style={tdStyle}>{formatAmount(item.amount)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
const tableStyle = {
	borderCollapse: 'collapse',
	width: '100%',
	overflowX: 'auto',
}

const thStyle = {
	border: '1px solid #dddddd', // Border for table header cells
	padding: '8px',
	textAlign: 'left',
	backgroundColor: 'black', // Background color
	color: 'white', // Text color
}

const tdStyle = {
	border: '1px solid #dddddd', // Border for table data cells
	padding: '8px',
	textAlign: 'left',
}

export default TableComponent
