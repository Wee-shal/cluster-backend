import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import serverUrl from "./config";

const Triangle = styled.div`
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 60vh 60vw 0 0;
  border-color: #000000 transparent transparent transparent;
  transform: rotate(0deg);
  position: absolute;
  z-index: 0;
  @media (max-width: 768px) {
    border-width: 60vh 70vw 0 0;
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

  @media (max-width: 768px) {
  }
`;

const SignHeading = styled.h1`
  font-size: 3rem;
  font-weight: bolder;

  @media (max-width: 768px) {
    background-color: white;
    padding: 0.5rem 1rem;
    border-radius: 24px;
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
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;

const OTPContainer = styled.input`
  outline: 2px solid black;
  border-radius: 24px;
  padding: 1rem 1rem;
  border: none;
  display: flex; /* Add this line */
  align-items: center;

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
  padding: 0.5rem 1rem; /* Adjusted padding for smaller button */
  /* Center the button within its container */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Adjust width as needed, but use min-width for responsiveness */
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

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validatePhoneNumber = (input) => {
    // Check if the phone number starts with + followed by the area code
    if (!/^\+\d{2}/.test(input)) {
      return " Number should start with + the country code";
    }

    // Check if the phone number has at least 10 digits
    if (!/\d{12}/.test(input.replace(/\D/g, ""))) {
      return "Phone number should have at least 10 digits.";
    }

    return ""; // If all checks pass, return an empty string (no error)
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

      const response = await fetch(`${serverUrl}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      console.log(data);

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
      const response = await fetch(`${serverUrl}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          otp,
        }),
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

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
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
    setErrorMessage(""); // Clear error message when typing
  };

  return (
    <>
      <Triangle></Triangle>
      <Container>
        <SignHeading>Sign In/Sign Up</SignHeading>
        <Form onSubmit={handleSubmit}>
          {!isPhoneVerified && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ContactNumberContainer
                placeholder="Contact Number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                style={{ marginBottom: '1rem' }}
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
