import styled from "styled-components";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import serverUrl from "./config";
import logo from "./assets/logo.png"
import { Link } from "react-router-dom";


const Triangle = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 35vw 35vw 0 0;
  border-color: #000 transparent transparent transparent;
  transform: rotate(0deg);
  position: absolute;
  z-index: 0;
  top: 0; /* Add this to position the triangle at the top */
  left: 0; 

  @media (max-width: 768px) {
    border-width: 30vw 60vw 0 0;
    display: none;
  }
`;
const LogoImage = styled.img`
  width: 150px; /* Set the width as needed */
  height: auto; /* Maintain the aspect ratio */
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  z-index: 1;
  background-color: #f5f5f5; /* Add your desired background color */
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5); /* Add a subtle box shadow */
  border-radius: 10px; /* Add rounded corners */
  padding: 2rem; /* Add padding for spacing */
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-bottom: 2rem;
`;

const Heading = styled.h1`
  font-size: 2rem;
  font-weight: bolder;
  cursor: pointer;
  background-color:${(props) => (props.selected ? "black" : "none")};
  color: ${(props) => (props.selected ? "white" : "grey")};
  padding: 10px 20px; /* Adjust padding as needed */
  border-radius: 10px; /* Adjust border-radius as needed */
  box-shadow: ${(props) =>
    props.selected ? "0 0 2px rgba(0, 0, 0, 0.5)" : "none"};
  transition: all 0.3s ease; /* Add transition for smooth animation */

  &:hover {
    transform: scale(1.05); /* Increase size on hover */
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;




const ContactNumberContainer = styled.input`
  outline: 2px solid black;
  border-radius: 24px;
  padding: 1rem 1rem;
  border: none;
  min-width: 20vw;
  max-width: 25vw;
  z-index: 1;

  &::placeholder {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    min-width: 70vw;
    max-width: 80vw;
  }
`;



const OTPContainer = styled.input`
  outline: 2px solid black;
  border-radius: 24px;
  padding: 0.5rem 0.5rem;
  border: none;
  display: flex;
  align-items: center;

  &::placeholder {
    font-size: 1rem;
  }

  width: 140px !important;
  height: 30px !important;

  @media (max-width: 768px) {
    min-width: 70vw;
    max-width: 80vw;
  }
`;

const SubmitButton = styled.button`
  cursor: pointer;
  background-color: black;
  color: white;
  border: none;
  border-radius: 1rem;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 8vw;
`;

const Form = styled.form`
  margin-top: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 0;
  margin-bottom: 2rem;
  text-align: center;
`;
const PolicyLink = styled(Link)`
  color: blue;
  justify-content: center;
  text-decoration:None;
`;
const UserAgreementLink = styled(Link)`
  color: blue;
  justify-content: center;
  text-decoration:None;
`;
const CookiePolicyLink = styled(Link)`
  color: blue;
  justify-content: center;
  text-decoration:None;
`;

const OTPErrorMessage = styled(ErrorMessage)`
  color: red;
  font-size: 0.9rem;
  margin-top: 0;
  margin-bottom: 0;
`;
const AcceptRulesCheckbox = styled.input`
  
`;
const AcceptRulesContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  margin-left:20px;
`;

const Verify = styled.button`
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  background-color: ${(props) => (props.disabled ? 'grey' : 'black')};
  color: white;
  outline: 1px solid black;
  border: none;
  padding: 1rem 2rem;
  border-radius: 1rem;
  margin-top: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.disabled ? 'grey' : '#333')};
  }

  &:active {
    background-color: ${(props) => (props.disabled ? 'grey' : '#555')};
  }

  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;




export default function AuthPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const navigate = useNavigate();
  const [showResendButton, setShowResendButton] = useState(false);
  const [isRulesAccepted, setIsRulesAccepted] = useState(false);
  


  const handleNavigateToPolicy = (e) => {
    e.preventDefault();
    navigate("../policy");
  };

  const handleNavigateToUserAgreement = (e) => {
    e.preventDefault();
    navigate("../UserAgreement");
  };

  const handleNavigateToCookiePolicy = (e) => {
    e.preventDefault();
    navigate("../UserAgreement");
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowResendButton(true);
    }, 20000); // Set timeout to 20 seconds

    return () => clearTimeout(timeoutId);
  }, []);
  const handleCheckboxChange = () => {
    setIsRulesAccepted(!isRulesAccepted);
  };

  useEffect(() => {
		const handleResize = () => {
			setIsSmallScreen(window.innerWidth <= 768)
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])
	const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768)

	useEffect(() => {
		const handleResize = () => {
			setIsSmallScreen(window.innerWidth <= 768)
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])


  





  const validatePhoneNumber = (input) => {
    if (!input.startsWith("+")) {
      return "Number should start with + country code and contact number.";
    }

    const digitsAfterFirstThree = input.slice(3).replace(/\D/g, "");
    if (input.length > 3 && digitsAfterFirstThree.length < 10) {
      return "Valid contact number to be inserted after the country code.";
    }

    if (!/^\+[\d]+$/.test(input)) {
      return "Please enter a valid number with the country code.";
    }

    return "";
  };

  const handleVerify = async (e, resend = false) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const validationError = validatePhoneNumber(phoneNumber);
      if (validationError) {
        throw new Error(validationError);
      }

      let requestBody;
      if (isSignIn) {
        requestBody = { phoneNumber, otp };
      } else {
        requestBody = { phoneNumber, username, otp };
      }

      const endpoint = resend ? `${serverUrl}/resend-otp` : `${serverUrl}/send-otp`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setIsPhoneVerified(true);
        setSuccessMessage("OTP sent successfully!");
      } else {
        setErrorMessage(`${data.message}\nCheck the number or country code!`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let requestBody;
      if (isSignIn) {
        requestBody = { phoneNumber, otp };
      } else {
        requestBody = { phoneNumber, username, otp };
      }

      console.log("Request Body:", requestBody);
      const response = await fetch(`${serverUrl}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log("OTP verification successful");
        window.localStorage.setItem("id", result.userId);
        navigate("/");
        window.location.reload();
      } else {
        setErrorMessage("Invalid OTP");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.message);
      setErrorMessage("Error during OTP verification. Please try again.");
    }
  };
  const HeadingContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  margin-top:1rem;
`;

const ClustleHeading = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #333; /* Adjust color to your preference */ /* Remove default margin */
  margin:0 auto; 
`;

  const handlePhoneNumberChange = (e) => {
    let input = e.target.value;
    input = input.replace(/[^+\w]/g, "");
    setPhoneNumber(input);
    if (input.trim() !== "") {
      const validationError = validatePhoneNumber(input);
      setErrorMessage(validationError);
    } else {
      setErrorMessage("");
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setErrorMessage("");
  };

  const handleClick = () => {
    window.location.href = '/';
  };
  return (
    <><Triangle></Triangle>
            <HeadingContainer>
          <ClustleHeading style={{cursor: 'pointer'}}><LogoImage onClick={handleClick} src={logo} alt="Clustle Logo" /></ClustleHeading>
        </HeadingContainer>

      <Container>
        <HeadingContainer>
          <Heading onClick={() => setIsSignIn(false)} selected={!isSignIn}>
            Sign Up
          </Heading>
          <Heading onClick={() => setIsSignIn(true)} selected={isSignIn}>
            Sign In
          </Heading>
        </HeadingContainer>
        <Form onSubmit={handleSubmit}>
          {!isPhoneVerified && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {!isSignIn && (
  <>
    <ContactNumberContainer
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      style={{ marginBottom: '1rem' }}
    />
    <ContactNumberContainer
                placeholder={isSignIn ? "Phone Number" : "Contact Number"}
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                style={{ marginBottom: '1rem' }}
                maxLength="13"
              ></ContactNumberContainer>
              {errorMessage && (
                <ErrorMessage>{errorMessage}</ErrorMessage>
              )}
              {successMessage && (
                <div style={{ color: 'green', marginTop: '0.1rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                  {successMessage}
                </div>
              )}
              <AcceptRulesContainer >
<AcceptRulesCheckbox
              type="checkbox"
              id="acceptRulesCheckbox"
              checked={isRulesAccepted}
              onChange={handleCheckboxChange}
              style={{marginBottom:isSmallScreen?'24px':'21px'}}
            />
            <label htmlFor="acceptRulesCheckbox">
    By clicking verify, you agree to the Clustle <UserAgreementLink to="../UserAgreement" onClick={handleNavigateToUserAgreement}>
      Terms of Service
    </UserAgreementLink>,{' '}
    <PolicyLink to="../policy" onClick={handleNavigateToPolicy}>
      Privacy Policy
    </PolicyLink>{' '}
     and{' '}
     <CookiePolicyLink to="../CookiePolicy" onClick={handleNavigateToCookiePolicy}>
      Cookie Policy
    </CookiePolicyLink>
  </label>
            


            </AcceptRulesContainer>

            <Verify
              onClick={(e) => handleVerify(e, false)}
              disabled={isLoading || !isRulesAccepted}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Verify>

    
  </>
  
)}
{isSignIn && (
  <>
    <ContactNumberContainer
      placeholder="Phone Number"
      value={phoneNumber}
      onChange={handlePhoneNumberChange}
      style={{ marginBottom: '1rem' }}
      maxLength={13}
    />
    {errorMessage && (
      <ErrorMessage>{errorMessage}</ErrorMessage>
    )}
    {successMessage && (
      <div style={{ color: 'green', marginTop: '0.1rem', marginBottom: '0.5rem', textAlign: 'center' }}>
        {successMessage}
      </div>
    )}
    <Verify
      onClick={(e) => handleVerify(e, false)}
    >
      {isLoading ? "Verifying..." : "Verify"}
    </Verify>
  </>
)}

            </div>
          )}
          {isPhoneVerified && (
            <>
              <OTPContainer
                placeholder="Confirm your OTP"
                value={otp}
                onChange={handleOtpChange}
                maxLength="4"
              ></OTPContainer>
              {errorMessage && (
                <OTPErrorMessage>{errorMessage}</OTPErrorMessage>
              )}
              
              {showResendButton && (
              <Verify  id='resend'onClick={(e) => handleVerify(e, false)} disabled={isLoading} style={{
            visibility:  'visible',
            cursor: 'pointer',
    backgroundColor: 'black',
    color: 'white',
    outline: '1px solid black',
    border: 'none',
    padding: '7px',
    borderRadius: '1rem',
    transition: 'background-color 0.3s ease',
  }}
  onMouseOver={(e) => { e.target.style.backgroundColor = '#333' }}
  onMouseOut={(e) => { e.target.style.backgroundColor = 'black' }}
  onMouseDown={(e) => { e.target.style.backgroundColor = '#555' }}
  onMouseUp={(e) => { e.target.style.backgroundColor = '#333' }}
      
          >
                Resend OTP
              </Verify>
)}
<SubmitButton   style={{
    cursor: 'pointer',
    backgroundColor: 'black',
    color: 'white',
    outline: '1px solid black',
    border: 'none',
    transition: 'background-color 0.3s ease',
  }}
  onMouseOver={(e) => { e.target.style.backgroundColor = '#333' }}
  onMouseOut={(e) => { e.target.style.backgroundColor = 'black' }}
  onMouseDown={(e) => { e.target.style.backgroundColor = '#555' }}
  onMouseUp={(e) => { e.target.style.backgroundColor = '#333' }}
>Submit</SubmitButton>
            </>
          )}
        </Form>
      </Container>
    </>
  );
}