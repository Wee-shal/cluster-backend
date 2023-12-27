import PropTypes from 'prop-types'
import dial from '../../assets/icons/dial.svg'
import styled from 'styled-components'

const EndCallButton = styled.button`
	background: red;
	padding: 0.5rem 1rem 0.5rem 1rem;
	border-radius: 22%;
	border: none;
	cursor: pointer;
	width: ${prop => prop.width || 'auto'};
	&:hover {
		background-color: #ef0000;
	}
`
export function EndCall({ onClick }) {
	const handleEndCall = () => {
		// Perform any logic you need when ending the call
	
		// Call the provided onClick function
		if (onClick) {
		onClick();
		}
	
		// Navigate to the homepage using window.location
		window.location.href = '/';
 };
	
	

	return (
		<EndCallButton onClick={handleEndCall}>
			<img src={dial} alt="End Call" width={'70%'} />
		</EndCallButton>
	)
}

EndCall.propTypes = {
	onClick: PropTypes.func.isRequired,
}
