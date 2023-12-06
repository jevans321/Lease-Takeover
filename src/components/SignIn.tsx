import usePasswordValidation from './usePasswordValidation';
import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SignIn: React.FC = () => {
  const { passwordError, validatePassword } = usePasswordValidation();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isLoginMode) {
      // Login logic
      try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, {
          email: formData.email,
          password: formData.password,
        });
        console.log(response.data); // Process login response
      } catch (error) {
        console.error('Login error', error);
        // Handle login error
      }
    } else {
      // Registration logic
      try {
        const response = await axios.post(`${API_BASE_URL}/users/register`, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
        console.log(response.data); // Process registration response
      } catch (error) {
        console.error('Registration error', error);
        // Handle registration error
      }
    }
  };

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    // Validate password on change
    if (name === 'password') {
      validatePassword(value);
    }
  };

  // Toggle between Login and Register
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {isLoginMode ? 'Landlord Login' : 'Landlord Registration'}
      </Typography>

      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
          <>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </>
        )}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          error={!!passwordError}
          helperText={passwordError || 'Use 8 or more characters with a mix of letters, numbers & symbols.'}
        />

        <Button variant="contained" color="primary" type="submit" style={{ margin: '20px 0' }}>
          {isLoginMode ? 'Login' : 'Register'}
        </Button>
      </form>

      <Button onClick={toggleMode}>
        {isLoginMode ? 'Need to register?' : 'Already have an account?'}
      </Button>
    </Container>
  );
};

export default SignIn;
