import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import pizza from './images/pizza.jpg';

function Home() {
  const navigate = useNavigate(); // Get the navigate function from the hook

  // Handler function to navigate to the order page - task 3
  const navigateToOrder = () => {
    navigate('/order'); // Use the navigate function to change the route
  };

  return (
    <div>
      <h2>Welcome to Bloom Pizza!</h2>
      {/* Image with onClick handler to navigate to "/order" */}
      <img
        alt="order-pizza"
        style={{ cursor: 'pointer' }} // hover to indicate it's clickable
        src={pizza}
        onClick={navigateToOrder} // Attached the navigate function to onClick event
      />
    </div>
  );
}

export default Home;

