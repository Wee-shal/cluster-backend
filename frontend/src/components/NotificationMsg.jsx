import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const bounceIn = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0px);
  }
  40% {
    transform: translateY(10px);
  }
  60% {
    transform: translateY(1px);
  }  
`
const Container = styled.div`
	display: flex;
	justify-content: center;
	position: fixed;
	margin: auto;
	width: 20%;
	left: 0;
	right: 0;
	top: 1rem;
	background-color: #2f2f2f;
	padding: 0.7rem 2rem;
	z-index: 10;
	color: white;
	animation: ${bounceIn} 1s ease-in-out;
	border-radius: 0.5rem;
`
export default function NotificationMessage({ message }) {
	return <Container>{message}</Container>
}

NotificationMessage.propTypes = {
	message: PropTypes.string.isRequired,
}
