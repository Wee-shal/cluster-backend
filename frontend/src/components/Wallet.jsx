import { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../services/helpers'
import { userContext } from '../state/userState'

const Container = styled.div`
	position: absolute;
	top: 1.5rem;
	right: 7rem;
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
const id = window.localStorage.getItem("id")
	useEffect(() => {
		(async () => {
			const user = await getUser(id)
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
