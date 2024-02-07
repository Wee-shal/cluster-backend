import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const policyPageStyles = {
  fontFamily: 'Arial, sans-serif',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#f9f9f9', // Add a background color
  border: '1px solid #ddd', // Add a border for separation
};

const headingStyles = {
  color: '#333',
  borderBottom: '1px solid #ccc',
  paddingBottom: '10px', // Add spacing below headings
};

const paragraphStyles = {
  marginBottom: '15px', // Add spacing between paragraphs
};

const linkStyles = {
  color: '#007BFF',
  textDecoration: 'underline',
};

const Policy = () => {
  return (
    <div>
      <div style={{position:'sticky'}}>
    <Navbar />
    </div>
    <div style={policyPageStyles}>
      <h1 style={headingStyles}>Privacy Policy for Clustle</h1>

      <p>
      We do not record any calls or video calls made through our platform, nor do we save any data related to them. Your privacy during communication sessions is important to us, and we do not retain any recordings or data from these interactions. Any information exchanged during calls or video calls is transient and not stored by us.{""}
        In this Privacy Policy (“Policy”), we describe how Clustle (“we” or “us”) collects, uses, and discloses information that we obtain about visitors to our website <a href="https://clustle.com" style={linkStyles}>https://clustle.com</a> (the “Site,” including subdomains like members and discuss) and the services available through our Site (collectively, the “Services”).
        <p>The Information We Collect About You.</p>
<h2>Information We Collect Directly From You:</h2>
<ul>
  <li>Your first and last name</li>
  <li>Password</li>
  <li>Email address</li>
  <li>Country</li>
  <li>Date you joined OSI as a member</li>
</ul>


<h2>Information We Collect Automatically:</h2>
<p>We automatically collect information about your use of our Site through cookies, web beacons, and other technologies. To the extent permitted by applicable law, we combine this information with other information we collect about you, including your personal information. Please see the section “Cookies and Other Tracking Mechanisms” below for more information.</p>

<p>We collect the following information when you visit our Site:</p>
<ul>
  <li>Your browser type and operating system</li>
  <li>Web pages you view on the Site</li>
  <li>Links you click on the Site</li>
  <li>Your IP address</li>
  <li>Your geolocation</li>
  <li>The length of time you visit our Site and/or use our Services</li>
  <li>The referring URL, or the webpage that led you to our Site</li>
</ul>

<h2>How We Use Your Information:</h2>
<ul>
  <li>To provide our Services to you, including managing and administering your membership with our organization.</li>
  <li>To manage any sponsorship activities you engage in with us.</li>
</ul>
</p>
      <h2 style={headingStyles}>Changes to this Policy</h2>
      <p>
        This Policy is current as of the Effective Date set forth above. We may change this Policy from time to time, so please be sure to check back periodically. We will post any changes to this Policy on our Site. If we make any changes to this Policy that materially affect our practices with regard to the personal information we have previously collected from you, we will endeavor to provide you with notice in advance of such change by highlighting the change on our Site.
      </p>
    </div>
    <Footer/>
    </div>
  );
};

export default Policy;
