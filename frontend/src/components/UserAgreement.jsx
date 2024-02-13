import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const Container = styled.div`
  font-family: 'Arial, sans-serif';
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  min-height: calc(100vh - 130px); /* Adjust the value based on your Footer and Navbar heights */
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  margin-bottom: 10px;
`;

const Link = styled.a`
  color: #007bff;
  text-decoration: underline;
`;

const UserAgreementContainer = styled.div`
  position: relative;
  min-height: 100vh;
`;

const StickyNavbar = styled(Navbar)`
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const UserAgreement = () => {
    return (
      <UserAgreementContainer>
        <StickyNavbar />
        <Container>
          <Title style={{fontWeight:'bold'}}>Terms of Service</Title>
          
          <Section>
            <Paragraph>
              This User Agreement ("Agreement") governs your access and use of Clustle ("Website"). By accessing or using the Website, you agree to be bound by the terms and conditions of this Agreement. If you do not agree to all the terms and conditions of this Agreement, you may not access or use the Website.
            </Paragraph>
          </Section>
  
          <Section>
            <Title>Acceptance of Terms</Title>
            <Paragraph>
              By using Clustle, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement. If you do not agree with any part of these terms, you should not use the Website.
            </Paragraph>
          </Section>
  
          <Section>
            <Title>Prohibited Activities</Title>
            <Paragraph>
              You agree not to engage in any activity that may interfere with or disrupt the functioning of Clustle. Prohibited activities include, but are not limited to, attempting to gain unauthorized access to Clustle or its servers, using automated methods to access the Website, and violating any applicable laws or regulations.
            </Paragraph>
          </Section>
  
          <Section>
            <Title>Modifications to Agreement</Title>
            <Paragraph>
              Clustle reserves the right to modify this Agreement at any time. Any changes will be effective immediately upon posting the revised Agreement on the Website. Your continued use of Clustle after the posting of changes constitutes your acceptance of the modified Agreement.
            </Paragraph>
          </Section>
  
          <Section>
            <Title>Disclaimer of Warranties</Title>
            <Paragraph>
              Clustle and its Content are provided "as is" without warranties of any kind, express or implied. Clustle does not warrant that the Website will be error-free, secure, or uninterrupted.
            </Paragraph>
          </Section>
  
          {/* Add more sections as needed */}
          
          <Section>
            <Title>Effective Date</Title>
            <Paragraph>
              This Agreement is effective as of [10/12/2023]. Last Updated: [29/01/24].
            </Paragraph>
          </Section>
        </Container>
        <Footer />
      </UserAgreementContainer>
    );
  };
export default UserAgreement;
