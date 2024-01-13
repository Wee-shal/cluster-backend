// import React, { useState, useEffect, useContext } from 'react';
// import Video from 'twilio-video';
// import styled from 'styled-components';
// import { useNavigate } from 'react-router-dom';
// import { getToken } from '../services/tokenService';
// import { AudioToggle } from './buttons/AudioToggle';
// import { VideoToggle } from './buttons/VideoToggle';
// import { EndCall } from './buttons/EndCall';
// import { userContext } from '../state/userState';
// import { ShareScreenToggle } from './buttons/ShareScreenToggle';
// import shareScreen from '../assets/icons/shareScreen.svg';
// import ChatScreen from '../components/ChatScreen';
// import { ChatToggle } from './buttons/ChatToggle';
// import NotificationMessage from '../components/NotificationMsg';
// import { getUser } from '../services/helpers';

// const Container = styled.div`
//     height: 100vh;
//     background-color: #000000;
//     position: relative;
// `;

// const ParticipantsWrapper = styled.div`
//     width: 20%;
//     height: 20%;
// `;

// const Participants = styled.div`
//     position: absolute;
//     right: 10px;
//     bottom: 0;
//     height: 200px;
//     top: auto;
// `;

// const UsernameContainer = styled.div`
//     text-align: center;
//     position: absolute;
//     bottom: 0;
//     background-color: black;
//     color: white;
//     border-top-right-radius: 0px;
//     margin: 0 auto;
// `;

// const InCallControlsContainer = styled.div`
//     position: absolute;
//     bottom: 1rem;
//     left: 0;
//     right: 0;
//     display: flex;
//     gap: 1rem;
//     justify-content: center;
//     z-index: 1;

//     @media (max-width: 768px) {
//     }
// `;

// const ShareScreenToggleButton = styled.button`
//     background-color: gray;
//     padding: 0.5rem 1rem 0.5rem 1rem;
//     border-radius: 22%;
//     border: none;
//     cursor: pointer;
//     width: ${prop => prop.width || 'auto'};
//     &:hover {
//         background-color: #7270709f;
//     }
// `;

// const Main = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-radius: 0.2rem;
//     height: 100%;
//     width: 75%;
//     flex: 3;
//     background-color: #2b2b2b;
// `;

// const SideContainer = styled.div`
//     display: flex;
//     flex: 1;
//     flex-direction: column;
//     background-color: blanchedalmond;
// `;

// const LocalParticipant = styled.div`
//     flex: 1;
//     background-color: #1f1f1f;
//     z-index: 1;
//     display: flex;
//     justify-content: center;
//     align-items: center;
// `;

// const RemoteParticipant = styled.div`
//     flex: 1;
//     background-color: #e9a105;
//     z-index: 2;
//     display: flex;
//     justify-content: center;
//     align-items: center;
// `;

// const ScreensWrapper = styled.div`
//     position: absolute;
//     top: 1.5rem;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     display: flex;
//     background-color: green;
//     height: 80%;
//     width: 90%;
//     margin: 0 auto;

//     @media (max-width: 768px) {
//         top: 0;
//     }
// `;

// const AudioParticipant = styled.div`
//     display: hidden;
// `;

// export default function AVCallScreen({ userId }) {
//     const [connected, setConnected] = useState(false);
//     const [room, setRoom] = useState(null);
//     const [localIdentity, setLocalIdentity] = useState('');
//     const [remoteIdentity, setRemoteIdentity] = useState('');
//     const [currentParticipant, setCurrentParticipant] = useState();
// 	const [isCallPickedUp, setIsCallPickedUp] = useState(false);
//     const {
//         user,
//         setUser,
//         isUserMute,
//         setIsUserMute,
//         isUserVideoOff,
//         setIsUserVideoOff,
//         isScreenSharingEnabled,
//         setIsScreenSharingEnabled,
//     } = useContext(userContext);
//     const [screenTrackData, setScreenTrackData] = useState(null);
//     const [remoteTracks, setRemoteTracks] = useState(null);
//     const [displayNotification, setDisplayNotification] = useState(false);
//     const [notificationMsg, setNotificationMsg] = useState('');
//     const [isRemoteShareScreenEnabled, setIsRemoteShareScreenEnabled] = useState(false);

//     const navigate = useNavigate();

//     useEffect(() => {
//         (async () => {
//             await connectOrDisconnect(userId || window?.location?.pathname?.split('/')[2]);
//             await addLocalVideo();
//             console.log('passed userId is : ', userId);
//         })();
//     }, []);

//     const addLocalVideo = async () => {
//         console.log('addLocalVideo');
//         const localParticipant = document.getElementById('localParticipant');
//         try {
//             removeTrackFromDiv(localParticipant);
//         } catch (e) {
//             console.log(e);
//         }
//         const videoTrack = await Video.createLocalVideoTrack();
//         const trackElement = videoTrack.attach();
//         trackElement.style.transform = 'scale(-1, 1)';
//         localParticipant.appendChild(trackElement);
//     };

//     const connectOrDisconnect = async identity => {
//         if (!connected) {
//             try {
//                 await connect(identity);
//             } catch (error) {
//                 console.log('connectOrDisconnect', error);
//                 alert('Failed to connect to video room.', error);
//             }
//         } else {
//             disconnect();
//         }
//     };

//     const connect = async identity => {
//         const roomName = 'room1';
//         const devName = identity;
//         let token;
//         try {
//             token = (await getToken(roomName, devName))?.token;
//         } catch (e) {
//             console.log(e);
//         }
//         console.log('Token from server: ', token);
//         const twilioRoom = await Video.connect(token);
//         setLocalIdentity(identity);
//         setRoom(twilioRoom);

//         twilioRoom.participants.forEach(participantConnected);
//         twilioRoom.on('participantConnected', participantConnected);
//         twilioRoom.on('participantDisconnected', participantDisconnected);
//         twilioRoom.on('disconnected', userDisconnect);
//         setConnected(true);
//     };

//     const userDisconnect = async () => {
//         console.log('user is disconnected');
//         const currentUserId = userId || window?.location?.pathname?.split('/')[2];
//         const user = await getUser(userId || window?.location?.pathname?.split('/')[2]);
//         setUser(user);
//         if (currentUserId === 'userId') {
//             if (user.balance > 0) {
//                 setNotificationMsg('User left call');
//             } else {
//                 setNotificationMsg('❗Out of balance, Call disconnected');
//             }
//         } else {
//             setNotificationMsg('User left the call');
//         }
//         setDisplayNotification(true);

//         if (!displayNotification) {
//             setTimeout(() => {
//                 setDisplayNotification(false);
//             }, 3000);
//         }

//         setTimeout(() => {
//             navigate('/');
//         }, 7000);
//     };

//     const disconnect = () => {
//         try {
//             console.log('in disconnect fn');
//             room.disconnect();
//             setConnected(false);
//             setRemoteIdentity('');
//             setLocalIdentity('');
//         } catch (e) {
//             console.log(e);
//         }
//     };

// 	const participantConnected = participant => {
// 		// ... (your existing code)
// 		console.log(`RemoteParticipant ${participant.identity} is connected`);

// 		setCurrentParticipant(participant);
// 		const remoteParticipantContainer = document.getElementById('remoteParticipant');
// 		setRemoteIdentity(participant.identity);

// 		// Update the state when the call is picked up
// 		setIsCallPickedUp(true);

// 		// ... (your existing code)
// 	};

//     const participantDisconnected = participant => {
//         const remoteParticipant = document.getElementById('remoteParticipant');
//         remoteParticipant.removeChild(document.getElementById(participant.sid));
//         setRemoteIdentity('');
//     };

//     const removeTrackFromDiv = div => {
//         console.log('removeTrackFromDiv hit');
//         const trackElement = div.querySelector('video');

//         if (trackElement) {
//             div.removeChild(trackElement);
//         }
//     };

//     const trackSubscribe = (div, track) => {
//         console.log('trackSubscribe hit');
//         if (isScreenSharingEnabled) {
//             const shareScreenContainer = document.querySelector('#screen_share_container');
//             if (shareScreenContainer) {
//                 shareScreenContainer.innerHTML = '';
//             }
//         }
//         console.log('trackSubcribe: ', JSON.stringify(track));
//         const trackElement = track.attach();
//         if (track.kind === 'video' && track.name !== 'screen') {
//             trackElement.style.transform = 'scale(-1, 1)';
//         }
//         div.appendChild(trackElement);
//     };

//     const handleVideoToggle = () => {
//         if (isUserVideoOff) {
//             room.localParticipant.videoTracks.forEach(publication => {
//                 if (publication.track.name !== 'screen') {
//                     publication.track.disable();
//                 }
//             });
//             const localParticipantElement = document.querySelector('#localParticipant');
//             localParticipantElement.style.backgroundColor = 'black';
//             localParticipantElement.style.position = 'relative';
//             const blackLayer = document.createElement('div');
//             blackLayer.style.position = 'absolute';
//             blackLayer.style.top = '0';
//             blackLayer.style.left = '0';
//             blackLayer.style.width = '100%';
//             blackLayer.style.height = '100%';
//             blackLayer.style.backgroundColor = 'rgba(17, 17, 17, 0.997)';
//             blackLayer.style.zIndex = '100';
//             blackLayer.setAttribute('id', 'blackLayer');
//             localParticipantElement.appendChild(blackLayer);
//         } else {
//             const blackLayer = document.querySelector('#blackLayer');
//             if (blackLayer) {
//                 const parentElement = blackLayer.parentElement;
//                 parentElement.removeChild(blackLayer);
//             }
//             room.localParticipant.videoTracks.forEach(publication => {
//                 if (publication.track.name !== 'screen') {
//                     publication.track.enable();
//                 }
//             });
//         }
//     };

//     const handleMuteToggle = () => {
//         if (!isUserMute) {
//             room.localParticipant.audioTracks.forEach(publication => {
//                 publication.track.disable();
//             });
//         } else {
//             room.localParticipant.audioTracks.forEach(publication => {
//                 publication.track.enable();
//             });
//         }
//     };

//     useEffect(() => {
//         if (connected) {
//             handleVideoToggle();
//         }
//     }, [isUserVideoOff]);

//     useEffect(() => {
//         if (connected) {
//             handleMuteToggle();
//         }
//     }, [isUserMute]);

//     async function shareScreenToggle() {
//         if (!isScreenSharingEnabled) {
//             await startScreenSharing();
//         } else {
//             stopScreenSharing();
//         }
//     }

//     let screenTrack;
//     const startScreenSharing = async () => {
//         setIsScreenSharingEnabled(true);

//         try {
//             const stream = await navigator.mediaDevices.getDisplayMedia();
//             const videoTrack = stream.getVideoTracks()[0];

//             screenTrack = new Video.LocalVideoTrack(videoTrack, {
//                 name: 'screen',
//             });

//             console.log('startScreenSharing-screenTrack: ', screenTrack);
//             setScreenTrackData(screenTrack);

//             await room.localParticipant.publishTrack(screenTrack);

//             const remoteParticipantContainer = document.getElementById('remoteParticipant');

//             const mainContainer = document.getElementById('main');
//             if (mainContainer) {
//                 mainContainer.innerHTML = '';
//             }

//             screenTrack.once('stopped', async () => {
//                 await room.localParticipant.unpublishTrack(screenTrack);
//                 setIsScreenSharingEnabled(false);
//             });

//             const screenShareVideo = document.createElement('video');
//             screenShareVideo.innerHTML = '';
//             screenShareVideo.srcObject = stream;
//             screenShareVideo.autoplay = true;
//             mainContainer.appendChild(screenShareVideo);

//             currentParticipant.tracks.forEach(publication => {
//                 trackSubscribe(remoteParticipantContainer, publication.track);
//             });
//         } catch (error) {
//             console.error('Error sharing the screen:', error);
//             setIsScreenSharingEnabled(false);
//         }
//     };

//     const stopScreenSharing = () => {
//         if (isScreenSharingEnabled === true) {
//             if (room) {
//                 screenTrackData.stop();
//                 room.localParticipant.unpublishTrack(screenTrackData);
//                 screenTrack = null;
//                 document.querySelector('#main').innerHTML = '';
//             }
//             setIsScreenSharingEnabled(false);

//             const mainContainer = document.querySelector('#main');
//             const remoteParticipantContainer = document.getElementById('remoteParticipant');
//             removeTrackFromDiv(remoteParticipantContainer);
//             removeTrackFromDiv(mainContainer);
//             currentParticipant.tracks.forEach(publication => {
//                 trackSubscribe(mainContainer, publication.track);
//             });
//         }
//     };

//     return (
//         <div>
//             {displayNotification && <NotificationMessage message={notificationMsg} />}
//             <Container>
//                 <ScreensWrapper>
//                     <Main id="main"></Main>
//                     <SideContainer>
//                         <RemoteParticipant id="remoteParticipant"> {isCallPickedUp && <h1>Picked Up</h1>}</RemoteParticipant>
//                         <LocalParticipant id="localParticipant"></LocalParticipant>
//                         <AudioParticipant></AudioParticipant>
//                         <ChatScreen userId={userId || window?.location?.pathname?.split('/')[2]} />
//                     </SideContainer>
//                 </ScreensWrapper>
//                 <InCallControlsContainer>
//                     <AudioToggle />
//                     <VideoToggle />
//                     <ShareScreenToggleButton onClick={shareScreenToggle}>
//                         <img src={shareScreen} width={'70%'} alt="Share Screen" />
//                     </ShareScreenToggleButton>
//                     <ChatToggle />
//                     <EndCall
//                         onClick={() => {
//                             if (connected) {
//                                 disconnect();
//                             }
//                             navigate('/');
//                         }}
//                     />
//                 </InCallControlsContainer>
//             </Container>
//         </div>
//     );
// }
import React, { useState, useEffect, useContext } from 'react'
import Video from 'twilio-video'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../services/tokenService'
import { AudioToggle } from './buttons/AudioToggle'
import { VideoToggle } from './buttons/VideoToggle'
import { EndCall } from './buttons/EndCall'
import { userContext } from '../state/userState'
import { ShareScreenToggle } from './buttons/ShareScreenToggle'
import shareScreen from '../assets/icons/shareScreen.svg'
import ChatScreen from '../components/ChatScreen'
import { ChatToggle } from './buttons/ChatToggle'
import NotificationMessage from '../components/NotificationMsg'
import { getUser } from '../services/helpers'

const Container = styled.div`
	height: 100vh;
	background-color: black;
	position: relative;
`

const ParticipantsWrapper = styled.div`
	width: 20%;
	height: 20%;
`

const Participants = styled.div`
	position: absolute;
	right: 10px;
	bottom: 0;
	height: 200px;
	top: auto;
`

const UsernameContainer = styled.div`
	text-align: center;
	position: absolute;
	bottom: 0;
	background-color: black;
	color: white;
	border-top-right-radius: 0px;
	margin: 0 auto;
`

const InCallControlsContainer = styled.div`
	position: absolute;
	bottom: 1rem;
	left: 0;
	right: 0;
	display: flex;
	gap: 1rem;
	justify-content: center;
	z-index: 1;

	@media (max-width: 768px) {
	}
`

const ShareScreenToggleButton = styled.button`
	background-color: gray;
	padding: 0.5rem 1rem 0.5rem 1rem;
	border-radius: 22%;
	border: none;
	cursor: pointer;
	width: ${prop => prop.width || 'auto'};
	&:hover {
		background-color: #7270709f;
	}
`

const Main = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 0.2rem;
	height: 75%;
	width: 75%;
	flex: 3;
	background-color: grey;
	overflow: hidden;
`

const SideContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	background-color: white;
	overflow: hidden;
	width: 50%;
`

const LocalParticipant = styled.div`
	flex: 1;
	background-color: #1f1f1f;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	width: 100%;
	height: 100%;
	video {
		width: 150%;
		height: 100%;
	}
`

const RemoteParticipant = styled.div`
	flex: 1;
	background-color: orange;
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	width: 100%; /* Set your desired width */
	height: 100%; /* Set your desired height */
	video {
		width: 150%;
		height: 100%;
	}
`

const ScreensWrapper = styled.div`
	position: absolute;
	top: 1.5rem;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	background-color: grey;
	height: 80%;
	width: 90%;
	margin: 0 auto;

	@media (max-width: 768px) {
		top: 0;
	}
`

const AudioParticipant = styled.div`
	display: hidden;
`

export default function AVCallScreen({ userId }) {
	const [connected, setConnected] = useState(false)
	const [room, setRoom] = useState(null)
	const [localIdentity, setLocalIdentity] = useState('')
	const [remoteIdentity, setRemoteIdentity] = useState('')
	const [currentParticipant, setCurrentParticipant] = useState()
	const [isCallPickedUp, setIsCallPickedUp] = useState(false)
	const {
		user,
		setUser,
		isUserMute,
		setIsUserMute,
		isUserVideoOff,
		setIsUserVideoOff,
		isScreenSharingEnabled,
		setIsScreenSharingEnabled,
	} = useContext(userContext)
	const [screenTrackData, setScreenTrackData] = useState(null)
	const [displayNotification, setDisplayNotification] = useState(false)
	const [notificationMsg, setNotificationMsg] = useState('')
	const [isRemoteShareScreenEnabled, setIsRemoteShareScreenEnabled] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		;(async () => {
			await connectOrDisconnect(userId || window?.location?.pathname?.split('/')[2])
			await addLocalVideo()
			console.log('passed userId is : ', userId)
		})()
	}, [])

	const addLocalVideo = async () => {
		console.log('addLocalVideo')
		const localParticipant = document.getElementById('localParticipant')
		try {
			removeTrackFromDiv(localParticipant)
		} catch (e) {
			console.log(e)
		}
		const videoTrack = await Video.createLocalVideoTrack()
		const trackElement = videoTrack.attach()
		trackElement.style.transform = 'scale(-1, 1)'
		localParticipant.appendChild(trackElement)
	}

	const connectOrDisconnect = async identity => {
		if (!connected) {
			try {
				await connect(identity)
			} catch (error) {
				console.log('connectOrDisconnect', error)
				alert('Failed to connect to video room.', error)
			}
		} else {
			disconnect()
		}
	}

	const connect = async identity => {
		const roomName = 'room1'
		const devName = identity
		let token
		try {
			token = (await getToken(roomName, devName))?.token
		} catch (e) {
			console.log(e)
		}
		console.log('Token from server: ', token)
		const twilioRoom = await Video.connect(token)
		setLocalIdentity(identity)
		setRoom(twilioRoom)

		twilioRoom.participants.forEach(participantConnected)
		twilioRoom.on('participantConnected', participantConnected)
		twilioRoom.on('participantDisconnected', participantDisconnected)
		twilioRoom.on('disconnected', userDisconnect)
		setConnected(true)
	}

	const userDisconnect = async () => {
		console.log('user is disconnected')
		const currentUserId = userId || window?.location?.pathname?.split('/')[2]
		const user = await getUser(userId || window?.location?.pathname?.split('/')[2])
		setUser(user)
		if (currentUserId === 'userId') {
			if (user.balance > 0) {
				setNotificationMsg('User left call')
			} else {
				setNotificationMsg('❗Out of balance, Call disconnected')
			}
		} else {
			setNotificationMsg('User left the call')
		}
		setDisplayNotification(true)

		if (!displayNotification) {
			setTimeout(() => {
				setDisplayNotification(false)
			}, 3000)
		}

		setTimeout(() => {
			navigate('/')
		}, 7000)
	}

	const disconnect = () => {
		try {
			console.log('in disconnect fn')
			room.disconnect()
			setConnected(false)
			setRemoteIdentity('')
			setLocalIdentity('')
		} catch (e) {
			console.log(e)
		}
	}

	const participantConnected = participant => {
		console.log(`RemoteParticipant ${participant.identity} is connected`)
		setCurrentParticipant(participant)
		setRemoteIdentity(participant.identity)
		setIsCallPickedUp(true)

		// Subscribe to the tracks of the connected participant
		console.log('tracks', participant.tracks)
		participant.tracks.forEach(publication => {
			if (publication.isSubscribed) {
				trackSubscribe(document.getElementById('remoteParticipant'), publication.track)
			} else {
				publication.on('subscribed', track => {
					trackSubscribe(document.getElementById('remoteParticipant'), track)
				})
			}
		})

		// Update the state when the call is picked up
		setIsCallPickedUp(true)
	}

	const participantDisconnected = participant => {
		const remoteParticipant = document.getElementById('remoteParticipant')
		remoteParticipant.removeChild(document.getElementById(participant.sid))
		setRemoteIdentity('')
	}

	const removeTrackFromDiv = div => {
		console.log('removeTrackFromDiv hit')
		const trackElement = div.querySelector('video')

		if (trackElement) {
			div.removeChild(trackElement)
		}
	}

	const trackSubscribe = (div, track) => {
		console.log('trackSubscribe hit')
		if (isScreenSharingEnabled) {
			const shareScreenContainer = document.querySelector('#screen_share_container')
			if (shareScreenContainer) {
				shareScreenContainer.innerHTML = ''
			}
		}

		const trackElement = track.attach()
		if (track.kind === 'video' && track.name !== 'screen') {
			trackElement.style.transform = 'scale(-1, 1)'
		}
		div.appendChild(trackElement)
	}

	const handleVideoToggle = () => {
		if (isUserVideoOff) {
			room.localParticipant.videoTracks.forEach(publication => {
				if (publication.track.name !== 'screen') {
					publication.track.disable()
				}
			})
			const localParticipantElement = document.querySelector('#localParticipant')
			localParticipantElement.style.backgroundColor = 'black'
			localParticipantElement.style.position = 'relative'
			const blackLayer = document.createElement('div')
			blackLayer.style.position = 'absolute'
			blackLayer.style.top = '0'
			blackLayer.style.left = '0'
			blackLayer.style.width = '100%'
			blackLayer.style.height = '100%'
			blackLayer.style.backgroundColor = 'rgba(17, 17, 17, 0.997)'
			blackLayer.style.zIndex = '100'
			blackLayer.setAttribute('id', 'blackLayer')
			localParticipantElement.appendChild(blackLayer)
		} else {
			const blackLayer = document.querySelector('#blackLayer')
			if (blackLayer) {
				const parentElement = blackLayer.parentElement
				parentElement.removeChild(blackLayer)
			}
			room.localParticipant.videoTracks.forEach(publication => {
				if (publication.track.name !== 'screen') {
					publication.track.enable()
				}
			})
		}
	}

	const handleMuteToggle = () => {
		if (!isUserMute) {
			room.localParticipant.audioTracks.forEach(publication => {
				publication.track.disable()
			})
		} else {
			room.localParticipant.audioTracks.forEach(publication => {
				publication.track.enable()
			})
		}
	}

	useEffect(() => {
		if (connected) {
			handleVideoToggle()
		}
	}, [isUserVideoOff])

	useEffect(() => {
		if (connected) {
			handleMuteToggle()
		}
	}, [isUserMute])

	async function shareScreenToggle() {
		if (!isScreenSharingEnabled) {
			await startScreenSharing()
		} else {
			stopScreenSharing()
		}
	}

	let screenTrack
	const startScreenSharing = async () => {
		setIsScreenSharingEnabled(true)

		try {
			const stream = await navigator.mediaDevices.getDisplayMedia()
			const videoTrack = stream.getVideoTracks()[0]

			screenTrack = new Video.LocalVideoTrack(videoTrack, {
				name: 'screen',
			})

			console.log('startScreenSharing-screenTrack: ', screenTrack)
			setScreenTrackData(screenTrack)

			await room.localParticipant.publishTrack(screenTrack)

			const remoteParticipantContainer = document.getElementById('remoteParticipant')

			const mainContainer = document.getElementById('main')
			if (mainContainer) {
				mainContainer.innerHTML = ''
			}

			screenTrack.once('stopped', async () => {
				await room.localParticipant.unpublishTrack(screenTrack)
				setIsScreenSharingEnabled(false)
			})

			const screenShareVideo = document.createElement('video')
			screenShareVideo.innerHTML = ''
			screenShareVideo.srcObject = stream
			screenShareVideo.autoplay = true
			mainContainer.appendChild(screenShareVideo)

			currentParticipant.tracks.forEach(publication => {
				trackSubscribe(remoteParticipantContainer, publication.track)
			})
		} catch (error) {
			console.error('Error sharing the screen:', error)
			setIsScreenSharingEnabled(false)
		}
	}

	const stopScreenSharing = () => {
		if (isScreenSharingEnabled === true) {
			if (room) {
				screenTrackData.stop()
				room.localParticipant.unpublishTrack(screenTrackData)
				screenTrack = null
				document.querySelector('#main').innerHTML = ''
			}
			setIsScreenSharingEnabled(false)

			const mainContainer = document.querySelector('#main')
			const remoteParticipantContainer = document.getElementById('remoteParticipant')
			removeTrackFromDiv(remoteParticipantContainer)
			removeTrackFromDiv(mainContainer)
			currentParticipant.tracks.forEach(publication => {
				trackSubscribe(mainContainer, publication.track)
			})
		}
	}

	return (
		<div>
			{displayNotification && <NotificationMessage message={notificationMsg} />}
			<Container>
				<ScreensWrapper>
					<Main id="main"></Main>
					<SideContainer>
						<RemoteParticipant id="remoteParticipant">
							{' '}
							{isCallPickedUp && <h1>Picked Up</h1>}
						</RemoteParticipant>
						<LocalParticipant id="localParticipant"></LocalParticipant>
						<AudioParticipant></AudioParticipant>
						<ChatScreen userId={userId || window?.location?.pathname?.split('/')[2]} />
					</SideContainer>
				</ScreensWrapper>
				<InCallControlsContainer>
					<AudioToggle />
					<VideoToggle />
					<ShareScreenToggleButton onClick={shareScreenToggle}>
						<img src={shareScreen} width={'70%'} alt="Share Screen" />
					</ShareScreenToggleButton>
					<ChatToggle />
					<EndCall
						onClick={() => {
							if (connected) {
								disconnect()
							}
							navigate('/')
						}}
					/>
				</InCallControlsContainer>
			</Container>
		</div>
	)
}
