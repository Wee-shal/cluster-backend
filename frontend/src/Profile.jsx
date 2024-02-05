import Navbar from './components/Navbar';
import Button from '@mui/material/Button';
import { useState, useEffect, useContext } from 'react';
import { getUser } from './services/helpers';
import { userContext } from "./state/userState";
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import serverUrl from './config';
import callIcon from './assets/icons/call.svg'
import videoIcon from './assets/icons/video.svg'
import Footer from './components/Footer';

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

const NotificationContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #e7e7e7;
  color: black;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  z-index: 1000;
  margin-bottom: 10px;
  max-width: 300px;
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
`;

const RechargeMessage = styled.p`
  margin-bottom: 10px;
`;

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

const Icon = styled.img.attrs(({ src }) => ({
  src,
}))`
  width: ${props => props.iconwidth || '15px'};
  filter: invert(1);
  margin-right: 10px;
`

export default function Profile() {
  const { user, setUser } = useContext(userContext);
  const [expert, setExpert] = useState({});
  const [isCallInitiated, setIsCallInitiated] = useState(false);
  const [isCallButtonPressed, setIsCallButtonPressed] = useState(false);
  const [notification, setNotification] = useState(false); // Set a default state here
  const id = window.localStorage.getItem("id");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const pathname = location.pathname;
      const username = pathname.split('/').pop();
      const userId = username;
      const expert = await getUser(userId);
      const user = await getUser(id);
      setUser(user);
      setExpert(expert);
    })();
  }, [id, setUser, location.pathname]);

  const makePhoneCall = async () => {
    if (user?.balance === 0 || user?.balance < expert?.rates) {
      setNotification(true)
      return null;
    }

    setIsCallButtonPressed(true);

    if (isCallInitiated) {
      setIsCallButtonPressed(false);
      setTimeout(() => {
        setIsCallInitiated(false);
      }, 4000);
      return null;
    }

    try {
      const response = await fetch(`${serverUrl}/calls/makeConferenceCall?expertId=${expert.userId}&userId=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        setIsCallButtonPressed(false);
        setIsCallInitiated(true);
        setNotification(true);
        setTimeout(() => {
          setNotification(false);
        }, 4000);
      } else {
        console.error('POST request failed');
        setNotification(true);
        setTimeout(() => {
          setNotification(false);
        }, 4000);
      }
    } catch (error) {
      console.error('Error occurred during POST request:', error);
      setNotification(true);
      setTimeout(() => {
        setNotification(false);
      }, 4000);
    } finally {
      setIsCallButtonPressed(false);
    }
  };

  const makeAVCall = () => {
    if (!user.balance) {
      setNotification(true)

      setInterval(() => {
        setNotification(false)
      }, 3000)
      return null
    } else {
      console.log(expert.userId)
      navigate(`/profile/${expert?.userId}/call`)
    }
  }

  const closeNotification = () => {
    setNotification(false);
  };

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', margin: '60px auto',minHeight:"100vh" }}>
        <img style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px', marginTop: '40px' }} src={expert?.profilePic} alt={expert?.name} />
        <div style={{ marginRight: '20%', marginLeft: '20%' }}>
          <h2>{expert?.name}</h2>
          <h3>{expert?.role}</h3>
          <p>{expert?.username}</p>
          <p><b>Price :$</b>{Math.ceil(expert?.rates * 10)} <b>/</b>10 mins</p>
          <p>{expert?.location}</p>
          <div style={{marginBottom: "50px"}}>
            <Button variant="contained" style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', borderRadius: '0', marginRight: "10px" }} onClick={id ? makePhoneCall : () => navigate(`/login`)}><Icon src={callIcon} />Phone</Button>
            <Button variant="contained" style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', borderRadius: '0' }} onClick={id ? makeAVCall : () => navigate(`/login`)}><Icon src={videoIcon} />Video</Button>
          </div>
          {notification && (
            <>
              <BlurredBackground style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(128, 128, 128, 0.7)', filter: 'blur(20px)', zIndex: 999 }} />
              <NotificationContainer style={{ position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%', padding: "10px", backgroundColor: '#e7e7e7', color: 'black', borderRadius: '0.5rem', textAlign: 'center', zIndex: 1000, marginBottom: '10px', maxWidth: '300px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <CloseButton style={{ position: 'absolute', top: '0.2rem', right: '0.2rem', background: '#e7e7e7', border: 'none', color: 'black', fontSize: '1rem', cursor: 'pointer' }} onClick={closeNotification}>&times;</CloseButton>
                {isCallInitiated ? (
                  <>
                    <RechargeMessage>Call has been initiated❗</RechargeMessage>
                  </>
                ) : (
                    <>
                      <RechargeMessage>Please recharge your wallet to continue❗</RechargeMessage>
                      <WalletButton style={{ backgroundColor: 'black', color: 'white', }} onClick={() => navigate('/payment')}>Recharge Wallet</WalletButton>
                    </>
                  )}
              </NotificationContainer>
            </>
          )}
          <p style={{marginBottom: '40px'}}>{expert?.description}</p>
          {expert && expert?.skills && expert?.skills?.map((skill, index) => (
            <span key={index} style={{ borderRadius: '10px', marginRight: '10px', border: '1px solid #000', padding: '5px', paddingRight: '5px', display: 'inline-block', marginTop: '5px', marginBottom: '4px' }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
      <Footer style={{marginBottom: '0px'}}/>
    </div>
    
  );
}