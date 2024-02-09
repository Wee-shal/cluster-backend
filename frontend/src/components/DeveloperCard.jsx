/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import callIcon from '../assets/icons/call.svg'
import { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { userContext } from '../state/userState'
import serverUrl from '../config'
import video from '../assets/icons/video.svg'

const AvPhoneCall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  background-color: black;
  flex: 1;
  text-align: center;
  transition: background-color 0.3s ease;
  height: 100%;
  cursor: pointer;
  color: white;
  &:hover {
    background-color: #333;
  }
  padding: 2rem auto;
`;
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
  display: ${props => (props.isCallInitiated ? 'none' : 'block')};
`

const WalletButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 0.5rem 0.2rem;
  border-radius: 0.2rem;
  margin-top: 0.5rem;
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
  filter: blur(5px);
  z-index: 999;
`;

const Card = styled.div`
  margin-top: 1rem;
  min-height: 18.3rem;
  width: 15rem;
  border-radius: 0.5rem;
  background-color: white; /* Dark background color */
  color: #161a1d; /* Text color */
  outline: 1px solid #333;
  text-align: center;
  padding-right: 0.2rem;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
  }
 
`;
const CloseButton = styled.button`
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  background: #e7e7e7;
  border: none;
  color: black;
  font-size: 1rem;
  cursor: pointer;
`

const RechargeMessage = styled.p`
  margin-bottom: 10px;
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
  z-index: 1000;
  margin: 10px;
  max-width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); 
`
const Name = styled.h3`
  margin-top: 0.5rem;
  margin-bottom:0.3px;
`
const Role = styled.p`margin-top: 0.25rem`
const ProfileImage = styled.img.attrs(({ src }) => ({
  src,
}))`
  width: 40%;
  margin-top: 0.4rem;
  border-radius:40px;
`
const Description = styled.p`
width: 200px; /* Adjust the width as needed */
display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
`

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
  background-color:black;
  border-radius:0 0 0 5px;
  flex: 1;
  text-align: center;
  transition: background-color 0.3s ease;
  height: 100%;
  cursor: pointer;
  color:white;
  &:hover {
    background-color: #333;
  }
  padding: 2rem auto;
`

const Icon = styled.img.attrs(({ src }) => ({
  src,
}))`
  width: ${props => props.iconwidth || '15px'};
  filter: invert(1);
`

const ProfileWrapper = styled.div`
  cursor: pointer;
  padding: 0.5rem 1rem;
`

export default function DeveloperCard({ name, profilePic, description, rates, developerId, hit }) {
  const [isCallInitiated, setIsCallInitiated] = useState(false)
  const [isCallButtonPressed, setIsCallButtonPressed] = useState(false)
  const { user, setUser } = useContext(userContext)
  const id = window.localStorage.getItem('id')
  const [notification, setNotification] = useState(false)
  const navigate = useNavigate()

  const makePhoneCall = async () => {
    if (user.balance === 0 || user.balance < rates) {
			setNotification(true)
			console.log('notifi', notification)

			return null
		}
		console.log('function makePhone Call triggered')
		setIsCallButtonPressed(true)    

    if (isCallInitiated) {
      setIsCallButtonPressed(false);
      setTimeout(() => {
        setIsCallInitiated(false);
      }, 4000);
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/calls/makeConferenceCall?expertId=${hit.userId}&userId=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        console.log('POST request successful');
        setIsCallButtonPressed(false);
        setIsCallInitiated(true);
      } else {
        console.error('POST request failed');
      }
    } catch (error) {
      console.error('Error occurred during POST request:', error);
    }
  };

  const closeNotification = () => {
    setNotification(false);
  };
  
	const makeAVCall = () => {
		if (!user.balance) {
			setNotification(true)

			setInterval(() => {
				setNotification(false)
			}, 3000)
			return null
		} else {
			navigate(`profile/${hit.userId}/call`)
		}
	}

  return (
    <>
      {notification && (
        <>
          <BlurredBackground />
          <NotificationContainer style={{ padding: '10px' }}>
            <CloseButton onClick={closeNotification}>&times;</CloseButton>
            <RechargeMessage>Please recharge your wallet to continue❗</RechargeMessage>
            <WalletButton onClick={() => navigate('/payment')}>Recharge Wallet</WalletButton>
          </NotificationContainer>
        </>
      )}
      <Card>
        <ProfileWrapper onClick={() => navigate(`/profile/${hit.userId}`)}>
          {isCallButtonPressed && (
            <CallStatusContainer isCallInitiated={isCallInitiated}>
              <p>Please wait, Your call is in progress</p>
            </CallStatusContainer>
          )}
          <ProfileImage src={profilePic} />
          <Name>{name}</Name>
          <Role><b>{hit.role}</b></Role>
          <Description>
  {description || "No description available"}
</Description>

<Price>
<b>Price</b> - {hit.currency}
{Math.ceil(rates * 10)} <b>/</b>10 mins


      </Price>

        </ProfileWrapper>
        <Container>
          <TwilioPhoneCall onClick={id ? makePhoneCall : () => navigate(`/login`)}>
            <Icon src={callIcon} />
            Phone Call
          </TwilioPhoneCall>
          <AvPhoneCall onClick={id ? makeAVCall : () => navigate(`/login`)}>
            <Icon src={video} style={{borderRadius:'0 0 2px 0' }}/>
            AV Call
          </AvPhoneCall>
        </Container>
      </Card>
    </>
  );
}

DeveloperCard.propTypes = {
  name: PropTypes.string.isRequired,
  profilePic: PropTypes.string.isRequired,
  description: PropTypes.string,
  rates: PropTypes.number.isRequired,
  developerId: PropTypes.string.isRequired,
  hit: PropTypes.object.isRequired,
};
