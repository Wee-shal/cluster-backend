import Navbar from './components/Navbar';
import Button from '@mui/material/Button';
import {useState, useEffect, useContext } from 'react';
import { getUser } from './services/helpers'
import {userContext} from "./state/userState"
import {useNavigate,useLocation} from 'react-router-dom'
import styled from 'styled-components'
import serverUrl from './config'

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

const NotificationContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: #e7e7e7;
	color: black
	padding: 1rem;
	border-radius: 0.5rem;
	text-align: center;
	z-index: 1000; /* Ensure it's above other elements */
	margin-bottom: 10px;
	max-width: 300px;
`;
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







export default function Profile(){
  const {user, setUser} = useContext(userContext)
  const [expert,setExpert] = useState({})
  const [isCallInitiated, setIsCallInitiated] = useState(false)
  const [isCallButtonPressed, setIsCallButtonPressed] = useState(false)
  const [notification, setNotification] = useState(false)
  const id = window.localStorage.getItem("id")
  const navigate = useNavigate()
  console.log("id",id)
  console.log("user",user)
  const location = useLocation()
  useEffect(() => {
		(async () => {
      const pathname=location.pathname;
      const username = pathname.split('/').pop();
      console.log("username",username)
      console.log("pathname",pathname)
			const userId = username;
			const expert = await getUser(userId)
			console.log("expert",expert)
      const user = await getUser(id)
			setUser(user)
      setExpert(expert)
		})()
	}, [])
console.log("expert outside",expert)
  
	const makePhoneCall = async () => {
		if (user.balance === 0) {
			setNotification(true)

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
			const response = await fetch(`${serverUrl}/calls/makeConferenceCall`, {
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
				alert('Call has been initiated')
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
    
    <div>
    <Navbar />
    <div style={{ textAlign: 'center', margin: '60px auto' }}>
      <img style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px', marginTop: '40px' }} src={expert?.profilePic} alt={expert?.name} />
      <div style={{ marginRight: '20%', marginLeft: '20%' }}>
        <h2>{expert?.name}</h2>
        <p>{expert?.role}</p>
        <p>{expert?.username}</p>
        <p>1K+ reviews 4.5★</p>
        <p>{expert?.location}</p>
		<div>
		
        <Button variant="contained" style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', borderRadius: '0' }} onClick={id ?makePhoneCall:()=>navigate(`/login`)}>Contact me</Button>
		
		</div>
		{notification && (
				<>
				<BlurredBackground />
				<NotificationContainer  style={{ padding: "10px" }}>
					<CloseButton onClick={closeNotification}>&times;</CloseButton>
					<RechargeMessage>Please recharge your wallet to continue❗</RechargeMessage>
                    <WalletButton onClick={() => navigate('/payment')}>Recharge Wallet</WalletButton>
				</NotificationContainer>
				</>
			)}
        <h2>Description</h2>
        <p>{expert.description}</p>
        <h2>Skills</h2>
        {expert && expert.skills && expert.skills.map((skill, index) => (
          <span key={index} style={{ borderRadius: '10px', marginRight: '10px', border: '1px solid #000', padding: '5px', paddingRight: '5px', display: 'inline-block', marginTop: '4px', marginBottom: '4px' }}>
            {skill}
          </span>
        ))}
      </div>
    </div>
    </div>
  );
}
