import styled from "styled-components";
import BackButton from "./components/buttons/BackButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    padding-top: 17vh;
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
  background-color: transparent;
  position: absolute;
  outline: 1px solid black;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  right: 0.7rem;
  top: 0.5rem;

  @media (max-width: 768px) {
    right: 3rem;
  }
`;
const OTPContainer = styled.input`
  outline: 2px solid black;
  border-radius: 24px;
  padding: 1rem 1rem;
  border: none;
  flex: none;
`;
const Button = styled.button`
  background-color: black;
  color: white;
  padding: 0.5rem 1rem;
  outline: none;
  border: none;
  cursor: pointer;
  flex: 1;
  margin: auto;
  margin-top: 2rem;
  width: 5rem;
  font-size: 1rem;
`;
const Form = styled.form`
  margin-top: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* align-items: center; */
  justify-content: center;
  text-align: center;
`;

const ContactNumberAndVerifyWrapper = styled.div`
  position: relative;
`;

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) alert(`${data.message}`);
      else alert(`${data.message}\nCheck the number or country code!`);
      // Handle success or error response from the server
      // ...
    } catch (error) {
      console.error("Error sending OTP:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/verify-otp", {
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
        window.localStorage.setItem("id", "abcd1");
        navigate("/");
        window.location.reload();
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.message);
    }
  };
  return (
    <>
      <Triangle></Triangle>
      <Container>
        <BackButton />
        <SignHeading>Sign In/Sign Up</SignHeading>
        <Form onSubmit={handleSubmit}>
          <ContactNumberAndVerifyWrapper>
            <ContactNumberContainer
              placeholder="Contact Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            ></ContactNumberContainer>
            <Verify onClick={handleVerify}>Verify</Verify>
          </ContactNumberAndVerifyWrapper>
          <OTPContainer
            placeholder="Confirm your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          ></OTPContainer>
          <Button>Submit</Button>
        </Form>
      </Container>
    </>
  );
}
