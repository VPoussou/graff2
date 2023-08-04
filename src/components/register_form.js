import React, { useState } from 'react';


const RegisterForm = () => {
  // Define state variables to hold form data and visibility status
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form behavior
  
    const userData = {
      username: username, // Gather the username from the form state
      email: email, // Gather the email from the form state
      password: password, // Gather the password from the form state
    };
  
    fetch('api/register', { // Send a POST request to the server
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Convert the user data to JSON
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        if (data.success) {
          // If registration was successful, navigate the user to a different page or show a success message
        } else {
          // If there was a problem with the registration, show an error message
        }
      })
      .catch((error) => {
        console.error(error.json); // Handle any errors with the request itself
      });
  };  

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>New User</button>
      {isVisible && (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nom d'utilisateur" onChange={(e) => setUsername(e.target.value)} />
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
