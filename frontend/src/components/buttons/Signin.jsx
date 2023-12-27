import { Link } from 'react-router-dom';

export default function Signin() {
      const buttonStyle = {
        backgroundColor: 'black', 
        color: 'white', 
        padding: '10px 20px',
        borderRadius: '5px', 
        fontSize: '16px', 
        cursor: 'pointer', 
        float: 'right'
      };
  return (
    <div>
    <Link to="/login">
    <button style={buttonStyle} >Sign in/Sign up</button>
    </Link>
    </div>
  )
}
