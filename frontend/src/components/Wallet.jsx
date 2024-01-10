import { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../services/helpers'
import { userContext } from '../state/userState'

const Container = styled.div`
	
	
	
	background-color: white;
	padding: 0.5rem 0.5rem;
	color: #080808;
	
	outline: ${({ balance }) => {
		if (balance === 0) {
			return ``
		} else if (balance < 20) {
			return ``
		} else if (balance > 20) {
			return ``
		}
	}};
	cursor: pointer;

	
`
const BalanceText = styled.div`
	
	
`
export default function Wallet() {
	const { user, setUser } = useContext(userContext)
	const navigate = useNavigate()
const id = window.localStorage.getItem("id")
	useEffect(() => {
		(async () => {
			const user = await getUser(id)
			setUser(user)
		})()
	}, [])
	const balance = user?.balance || 0;

	return (
		<Container balance={balance} onClick={() => navigate('/payment')}>
			<BalanceText>
			Balance: {user?.currency}
				{balance.toFixed(2).toLocaleString()}
			</BalanceText>
		</Container>
	)
}
