import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const CookiePolicy = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar style={stickyNavbar} />
      <div style={containerStyle}>
        <h1 style={headerStyle}>Cookie Policy</h1>

        <p style={paragraphStyle}>
          This website uses cookies to enhance the user experience. Cookies are small text files that are stored on your device by websites that you visit. They are widely used to make websites work or work more efficiently, as well as to provide information to the owners of the site.
        </p>

        <h2 style={subHeaderStyle}>Types of Cookies</h2>

        <ul style={listStyle}>
          <li>Session Cookies: These are temporary cookies that are erased when you close your browser.</li>
          <li>Persistent Cookies: These cookies remain on your device for a longer period or until you manually delete them.</li>
          <li>Third-party Cookies: These cookies are set by third-party domains, not the website you are currently visiting.</li>
        </ul>

        <h2 style={subHeaderStyle}>How We Use Cookies</h2>

        <p style={paragraphStyle}>
          We use cookies for various purposes, including but not limited to:
        </p>

        <ul style={listStyle}>
          <li>Analyzing site traffic and usage patterns</li>
          <li>Personalizing content and advertisements</li>
          <li>Improving overall user experience</li>
        </ul>

        <h2 style={subHeaderStyle}>Your Choices</h2>

        <p style={paragraphStyle}>
          You can choose to disable cookies through your browser settings. However, please note that disabling cookies may affect the functionality and performance of this website.
        </p>

        <p style={paragraphStyle}>
          By continuing to use this site without changing your settings, you consent to our use of cookies.
        </p>

        <h2 style={subHeaderStyle}>Managing Cookies</h2>

        <p style={paragraphStyle}>
          If you want to manage or disable cookies, you can do so through your browser settings. The specific steps may vary depending on the browser you are using. Refer to your browser's help or settings for more information.
        </p>

        <h2 style={subHeaderStyle}>Updates to Our Cookie Policy</h2>

        <p style={paragraphStyle}>
          We may update our Cookie Policy from time to time. Any changes will be posted on this page, so please check back periodically for updates.
        </p>

        <div style={backLinkStyle}>
          <Link to="/" style={linkStyle}>
            Back to Home
          </Link>
        </div>
        
      </div>
      <Footer />
    </div>
  );
};
// Styles
const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  flex: 1, // Expand to fill the available space
};

const headerStyle = {
  fontSize: '28px',
  marginBottom: '20px',
};

const subHeaderStyle = {
  fontSize: '24px',
  margin: '20px 0 10px',
};

const paragraphStyle = {
  marginBottom: '15px',
};

const listStyle = {
  marginLeft: '20px',
  marginBottom: '15px',
};

const backLinkStyle = {
  marginTop: '20px',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#007bff',
};
const stickyNavbar = {
  position: 'sticky',
  top: 0,
  zIndex: 1000,
};

export default CookiePolicy;
