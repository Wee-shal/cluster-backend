import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import serverUrl from "./config";

const Triangle = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 40vw 40vw 0 0;
  border-color: #000 transparent transparent transparent;
  transform: rotate(0deg);
  position: absolute;
  z-index: 0;

  @media (max-width: 768px) {
    border-width: 40vw 70vw 0 0;
  }
`;

const Container = styled.div`
  display: flex;
  padding-top: 30vh;
  position: relative;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  z-index: 1;
`;

const HeadingContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center; /* Ensure inline alignment */
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  font-weight: bolder;
  cursor: pointer;
  color: ${(props) => (props.selected ? "black" : "grey")};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeadingSeparator = styled.span`
  font-size: 2.5rem;
  font-weight: bolder;
  color: black;
  display: inline; /* Add for small screens */

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

const Verify = styled.button`
  cursor: pointer;
  background-color: black;
  color: white;
  outline: 1px solid black;
  border: none;
  padding: 1rem 2rem;
  border-radius: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    margin-top: 0.5rem;
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

const OTPErrorMessage = styled(ErrorMessage)`
  color: red;
  font-size: 0.9rem;
  margin-top: 0;
  margin-bottom: 0;
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

  const validatePhoneNumber = (input) => {
    if (!input.startsWith("+")) {
      return "Number should start with + country code and contact number.";
    }

    const digitsAfterFirstThree = input.slice(3).replace(/\D/g, "");
    if (input.length > 3 && digitsAfterFirstThree.length < 10) {
      return "Valid contact number to be inserted after country code.";
    }

    if (!/^\+[\d]+$/.test(input)) {
      return "Please enter a valid number with country code.";
    }

    return "";
  };

  const handleVerify = async (e) => {
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

      const response = await fetch(`${serverUrl}/send-otp`, {
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
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      setErrorMessage(error.message);
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
        navigate("/", { replace: true });
        window.location.reload();
      } else {
        setErrorMessage("Invalid OTP");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.message);
      setErrorMessage("Error during OTP verification. Please try again.");
    }
  };

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

  return (
    <>
      <Triangle></Triangle>
      <Container>
        <HeadingContainer>
          <Heading onClick={() => setIsSignIn(false)} selected={!isSignIn}>
            Sign Up
          </Heading>
          <HeadingSeparator>/</HeadingSeparator>
          <Heading onClick={() => setIsSignIn(true)} selected={isSignIn}>
            Sign In
          </Heading>
        </HeadingContainer>
        <Form onSubmit={handleSubmit}>
          {!isPhoneVerified && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {!isSignIn && (
                <ContactNumberContainer
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ marginBottom: '1rem' }}
                ></ContactNumberContainer>
              )}
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

              <Verify onClick={handleVerify} disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify"}
              </Verify>
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
              <SubmitButton>Submit</SubmitButton>
            </>
          )}
        </Form>
      </Container>
    </>
  );
}
