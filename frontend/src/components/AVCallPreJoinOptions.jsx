import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import videoIcon from '../assets/icons/videoOn.svg'
import videoOffIcon from '../assets/icons/videoOff.svg'
import micIcon from '../assets/icons/micOn.svg'
import micOffIcon from '../assets/icons/micOff.svg'
import VideoPreview from './VideoPreview'
import { userContext } from '../state/userState'
import { getTokenForAudioCall } from '../services/tokenService'

const CenteredContainer = styled.div`
	width: 45%;
	height: 50%;
	margin: auto;
	background-color: #d1d1d1;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	border-radius: 7px;
	padding: 2rem;
	@media (max-width: 768px) {
		width: 70%;
		height: 70%;
	}
`

const MuteButton = styled.button`
	font-size: 1rem;
	padding: 0.6rem 4rem 0.6rem 4rem;
	width: 11.5rem;
	margin-bottom: 1rem;
	background-color: #ffffff;
	outline: 2px solid #b1b1b1;
	border: none;
	border-radius: 2px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	&:hover {
		background-color: #eeeeee;
		transition: 0.2s;
	}
	@media (max-width: 768px) {
		padding: 0.6rem 1rem 0.6rem 1rem;
		width: 7rem;
	}
`

const StopVideo = styled.button`
	font-size: 1rem;
	padding: 0.6rem 4rem 0.6rem 4rem;
	width: 11.5rem;
	background-color: white;
	outline: 2px solid #b1b1b1;
	border: none;
	border-radius: 2px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	flex: 1;
	&:hover {
		background-color: #eeeeee;
		transition: 0.2s;
	}
	@media (max-width: 768px) {
		padding: 0.6rem 2rem 0.6rem 2rem;
		width: 7.5rem;
	}
`

const CancelButton = styled.button`
	font-size: 1rem;
	padding: 0.8rem 3rem 0.8rem 3rem;
	background-color: white;
	outline: 2px solid #b1b1b1;
	border: none;
	border-radius: 2px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	&:hover {
		background-color: #eeeeee;
		transition: 0.2s;
	}
`

const JoinNowbutton = styled.button`
	font-size: 1rem;
	padding: 0.6rem 3rem 0.6rem 3rem;
	background-color: white;
	outline: 2px solid #b1b1b1;
	border: none;
	border-radius: 2px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
	&:hover {
		background-color: #eeeeee;
		transition: 0.2s;
	}
`

const Container = styled.div`
	margin-top: ${props => props.margintop || 'auto'};
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex: 1;
	gap: 1rem;
	@media (max-width: 768px) {
		flex-direction: column;
		margin-top: auto;
	}
`

const ControlsContainer = styled.div`
	margin-top: 5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
	@media (max-width: 768px) {
		flex-direction: row;
		margin-top: 1rem;
		align-items: flex-start;
		gap: 1rem;
	}
`

const MainDiv = styled.div`
	position: relative;
`
const ButtonContainer = styled.div``

export default function AVCallPreJoinOptions({ setConnect, connect }) {
	const { isUserMute, setIsUserMute, isUserVideoOff, setIsUserVideoOff } = useContext(userContext)
	const userId = window?.location?.pathname?.split('/')[2]
	console.log(`Isusermute: ${isUserMute} \n isUserVideoOff: ${isUserVideoOff} `)
	const [joinRoom, setJoinRoom] = useState(false)
	const navigate = useNavigate()
	const [device, setDevice] = useState()
	useEffect(() => {
		let script

		const loadDevice = async () => {
			let token
			try {
				token = await getTokenForAudioCall()
				console.log('token for browserToPhoneCall: ', token)
			} catch (e) {
				console.log(e)
			}
			// Load the Twilio script dynamically
			script = document.createElement('script')
			script.src = 'https://sdk.twilio.com/js/client/releases/1.10.1/twilio.js'
			script.async = true

			script.onload = () => {
				// eslint-disable-next-line no-undef
				const deviceInstance = new Twilio.Device(token, {
					codecPreferences: ['opus', 'pcmu'],
					fakeLocalDTMF: true,
					enableRingingState: true,
				})

				setDevice(deviceInstance)
				deviceInstance.on('ready', () => {
					console.log('Device is ready')
					setDevice(deviceInstance)
				})

				deviceInstance.on('error', error => {
					console.log('Error occurred:', error)
				})
			}

			document.body.appendChild(script)
		}

		loadDevice()

		return () => {
			if (script) {
				document.body.removeChild(script)
			}
		}
	}, [])

	async function makeBrowserCall() {
		try {
			if (device) {
				device.connect()
				return true
			} else {
				alert('Loading the call module...')
				return false
			}
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<>
			{!connect && (
				<MainDiv>
					<CenteredContainer>
						<Container>
							<VideoPreview />
							<ControlsContainer>
								<ButtonContainer>
									<MuteButton onClick={() => setIsUserMute(!isUserMute)}>
										{isUserMute ? 'Mute' : 'Unmute'}
										<img src={isUserMute ? micOffIcon : micIcon} width="15px" />
									</MuteButton>
								</ButtonContainer>
								<ButtonContainer>
									<StopVideo onClick={() => setIsUserVideoOff(!isUserVideoOff)}>
										{isUserVideoOff ? 'Start' : 'Stop'}
										<img
											src={isUserVideoOff ? videoOffIcon : videoIcon}
											width="15px"
										/>
									</StopVideo>
								</ButtonContainer>
							</ControlsContainer>
						</Container>
						<Container margintop="3rem">
							<Container>
								<JoinNowbutton
									onClick={() => {
										if (userId !== 'developerId') {
											makeBrowserCall()
										}
										setJoinRoom(!joinRoom)
										setConnect(true)
									}}
								>
									Join
								</JoinNowbutton>
								<CancelButton onClick={() => navigate(-1)}>Cancel</CancelButton>
							</Container>
						</Container>
					</CenteredContainer>
				</MainDiv>
			)}
		</>
	)
}

AVCallPreJoinOptions.propTypes = {
	setConnect: PropTypes.func.isRequired,
	connect: PropTypes.bool.isRequired,
}