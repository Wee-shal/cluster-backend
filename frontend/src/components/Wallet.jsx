import { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../services/helpers'
import { userContext } from '../state/userState'

const Container = styled.div`
	position: absolute;
	top: 0.5rem;
	right: 2rem;
	background-color: #dedede;
	padding: 0.5rem 0.5rem;
	color: #080808;
	border-radius: 4%;
	outline: ${({ balance }) => {
		if (balance === 0) {
			return `2px solid red`
		} else if (balance < 20) {
			return `2px solid yellow`
		} else if (balance > 20) {
			return `2px solid green`
		}
	}};
	cursor: pointer;

	@media (max-width: 768px) {
		right: 1rem;
	}
`
export default function Wallet() {
	const { user, setUser } = useContext(userContext)
	const navigate = useNavigate()

	useEffect(() => {
		(async () => {
			const userId = 'abcd1'
			const user = await getUser(userId)
			console.log("user",user)
			console.log('userBalance: ', user.balance)
			setUser(user)
		})()
	}, [])

	return (
		<Container balance="1000" onClick={() => navigate('/payment')}>
			<div>
			Balance: {user?.currency}
			{user.balance?.toLocaleString()}
			</div>
		</Container>
	)
}