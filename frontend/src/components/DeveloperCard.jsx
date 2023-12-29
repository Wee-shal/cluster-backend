/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import callIcon from '../assets/icons/call.svg'
import { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { userContext } from '../state/userState'

const WalletButton = styled.button`
background-color: black; /* Updated background color to black */
color: white;
border: none;
padding: 0.5rem 0.2rem;
border-radius: 0.2rem;
margin-top: 0.5rem; /* Adjusted margin-top to position the button a little above the bottom border */
cursor: pointer;
margin-bottom: 10px;
`;

const BlurredBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(128, 128, 128, 0.5);
  filter: blur(5px); /* Adjust the blur amount as needed */
  z-index: 999; /* Ensure it's below the notification but above other elements */
`;


const Card = styled.div`
	margin-top: 1rem;
	min-height: 17rem;
	width: 15rem;
	border-radius: 0.1rem;
	outline: 1px solid #b8b8b8;
	text-align: center;
	padding-right: 0.2rem;
	position: relative;
	-webkit-box-shadow: 8px 9px 12px -12px rgba(0, 0, 0, 0.75);
	-moz-box-shadow: 8px 9px 12px -12px rgba(0, 0, 0, 0.75);
	box-shadow: 8px 9px 12px -12px rgba(0, 0, 0, 0.75);
`
const CloseButton = styled.button`
	position: absolute;
	top: 0.2rem;
	right: 0.2rem;
	background: #e7e7e7;;
	border: none;
	color: black;
	font-size: 1rem;
	cursor: pointer;
`

const RechargeMessage = styled.p`
  margin-bottom: 10px; /* Add margin to create space from the bottom */
`;

const NotificationContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: #e7e7e7;
	color: black
	padding: 100px;
	border-radius: 0.5rem;
	text-align: center;
	z-index: 1000; /* Ensure it's above other elements */
	margin: 10px;
	max-width: 300px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); 
`
const Name = styled.h3`
	margin-top: 0.4rem;
`

const ProfileImage = styled.img.attrs(({ src }) => ({
	src,
}))`
	width: 30%;
	margin-top: 1rem;
`
const Description = styled.p``

const Price = styled.p`
	margin-top: 0.5rem;
`
const Container = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #eaeaea;
	padding: 2rem auto;
	height: 3rem;
`
const TwilioPhoneCall = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.2rem;
	background-color: #e7e7e7;
	flex: 1;
	text-align: center;
	transition: background-color 0.3s ease;
	height: 100%;
	cursor: pointer;
	&:hover {
		background-color: #c9c9c9;
	}
	padding: 2rem auto;
`

const Icon = styled.img.attrs(({ src }) => ({
	src,
}))`
	width: ${props => props.iconwidth || '15px'};
`

const CallStatusContainer = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	padding: 0 1rem;
	width: auto;
	margin: auto;
	background-color: #515151;
	color: white;
	z-index: 3;
`
const ProfileWrapper = styled.div`
	cursor: pointer;
	padding: 0.5rem 1rem;
`
// eslint-disable-next-line no-unused-vars
export default function DeveloperCard({ name, profilePic, description, rates, developerId, hit }) {
	const [isCallInitiated, setIsCallInitiated] = useState(false)
	const [isCallButtonPressed, setIsCallButtonPressed] = useState(false)
	const { user } = useContext(userContext)
	const id = window.localStorage.getItem('id')
	const [notification, setNotification] = useState(false)
	const navigate = useNavigate()
	const makePhoneCall = async () => {
		if (user.balance === 0) {
			setNotification(true)
			console.log('notifi', notification)

			return null
		}
		console.log('function makePhone Call triggered')
		setIsCallButtonPressed(true)

		if (isCallInitiated) {
			setIsCallButtonPressed(false)
			alert('Please try again later...')
			setTimeout(() => {
				setIsCallInitiated(false)
			}, 4000)
			return null
		}
		try {
			const response = await fetch(`/calls/makeConferenceCall`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({}),
			})

			console.log('response, ', response)

			if (response.ok) {
				console.log('POST request successful')
				setIsCallButtonPressed(false)
				setIsCallInitiated(true)
			} else {
				console.error('POST request failed')
				alert('Failed to make a call')
			}
		} catch (error) {
			console.error('Error occurred during POST request:', error)
		}
	}
	const closeNotification = () => {
		setNotification(false)
	}
	return (
		<>
			{notification && (
				<>
				<BlurredBackground />
				<NotificationContainer style={{ padding: "10px" }}>
					<CloseButton onClick={closeNotification}>&times;</CloseButton>
					<RechargeMessage>Please recharge your wallet to continue❗</RechargeMessage>
                    <WalletButton onClick={() => navigate('/payment')}>Recharge Wallet</WalletButton>
				</NotificationContainer>
				</>
			)}
			<Card>
				<ProfileWrapper onClick={() => navigate(`/profile/${hit.userId}`)}>
					{isCallButtonPressed && (
						<CallStatusContainer>
							<p>Please wait, Your call is in progress</p>
						</CallStatusContainer>
					)}
					<ProfileImage src={profilePic} />
					<Name>{name}</Name>
					<Description>{description.slice(0, 26)}…</Description>
					<Price>
						<b>Price</b> - {hit.currency}
						{rates} /min
					</Price>
				</ProfileWrapper>
				<Container>
					<TwilioPhoneCall onClick={id ? makePhoneCall : () => navigate(`/login`)}>
						<Icon src={callIcon} />
						Phone Call
					</TwilioPhoneCall>
				</Container>
			</Card>
		</>
	)
}

DeveloperCard.propTypes = {
	name: PropTypes.string.isRequired,
	profilePic: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	rates: PropTypes.number.isRequired,
	developerId: PropTypes.string.isRequired,
	hit: PropTypes.object.isRequired,
}
