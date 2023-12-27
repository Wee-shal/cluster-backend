import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const Button = styled.button`
	position: absolute;
	top: 2rem;
	left: 2rem;
	width: 50px;
	height: 50px;
	border: none;
	border-radius: 50%;
	outline: none;
	cursor: pointer;
	font-size: 1.5rem;

	&:hover {
		background-color: #cacaca;
	}

	@media (max-width: 768px) {
		height: 40px;
		width: 40px;
	}
`
export default function BackButton() {
	const navigate = useNavigate()
	return (
		<>
			<Button onClick={() => navigate(-1)}>←</Button>
		</>
	)
}
