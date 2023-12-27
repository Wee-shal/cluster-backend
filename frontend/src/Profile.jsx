import Navbar from './components/Navbar';
import Button from '@mui/material/Button';
import userImage from './assets/user.png';
import {useState, useEffect, useContext } from 'react';
import { getUser } from './services/helpers'
import {userContext} from "./state/userState"
import NotificationMessage from './components/NotificationMsg'
import {useNavigate,useLocation} from 'react-router-dom'
import SearchBar from './components/SearchBar';
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
  const user1 = {
    name: "Hagemaru",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    picture: userImage,
    skills: [
      "logo-design",
      "graphic design",
      "branding",
      "takendown",
      "adobe photoshop",
      "adobe-illustrator",
      "poster design",
      "icon design",
    ],
    role: "web designer",
    username: "@johndoe",
    rating: "1K+ reviews 4.5★",
    location: "India",
  };

  
	const makePhoneCall = async () => {
		if (!user.balance) {
			setNotification(true)

			setInterval(() => {
				setNotification(false)
			}, 3000)
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
			const response = await fetch(`/makeConferenceCall`, {
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
  return (
    
    <div>
      {notification && (
				<NotificationMessage message="Please recharge your wallet to continue❗" />
			)}
    <Navbar />
    <div style={{ textAlign: 'center', margin: '60px auto' }}>
      <img style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px', marginTop: '40px' }} src={expert.profilePic} alt={expert.name} />
      <div style={{ marginRight: '20%', marginLeft: '20%' }}>
        <h2>{expert.name?expert.name:user1.name}</h2>
        <p>{expert.role}</p>
        <p>{expert.username}</p>
        <p>{user1.rating}</p>
        <p>{expert.location}</p>
		<div>
		
        <Button variant="contained" style={{ backgroundColor: 'black', color: 'white', fontWeight: 'bold', borderRadius: '0' }} onClick={id ?makePhoneCall:()=>navigate(`/login`)}>Contact me</Button>
		
		</div>
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
