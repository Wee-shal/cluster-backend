import React from 'react';

const Policy = () => {
  return (
    <div style={{ margin: '0 50px',justifyContent:'center' }}>
      <h1 style={{justifyContent:'center'}}> Policy</h1>
      <p>Welcome to Pagify policy. We're committed to providing you with a seamless shopping experience.</p>

      <h3>Shipping Methods:</h3>
      <ul>
        <li>In-Store Pickup: You can pick up your orders at our location.</li>
        <li>Delivery: We offer delivery service for your convenience.</li>
      </ul>

      <h3>Shipping Costs:</h3>
      <p>Our shipping costs vary based on your location and order size. You can find the shipping cost at the checkout.</p>

      <h3>Delivery Times:</h3>
      <p>Our estimated delivery times are as follows:</p>
      <ul>
        <li>In-Store Pickup: Orders are typically ready within 7 days.</li>
        <li>Delivery: Orders will be delivered within 7 days.</li>
      </ul>
      <p>Please note that delivery times may be affected by holidays or processing times.</p>

      <h3>Tracking:</h3>
      <p>You will receive a tracking number via email for delivered orders. In-store pickup orders will receive a notification when they are ready for pickup.</p>

      <h3>International Shipping:</h3>
      <p>We do not currently offer international shipping.</p>

      <h3>Lost or Damaged Items:</h3>
      <p>If your order arrives damaged or is lost during shipping, please contact our customer support team, and we will assist you promptly.</p>

      <h3>Contact Information:</h3>
      <p>If you have any questions about our shipping policy, feel free to contact us at <a href="https://www.emortech.com">contact@emortech.in</a>.</p>
    </div>
  );
};

export default Policy;
