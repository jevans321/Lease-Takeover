import React, { useState } from 'react';
import axios from 'axios';
import './PostListing.css';
import usePasswordValidation from './utility/usePasswordValidation';
import { useFormValidation } from './utility/useFormValidation';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PostListing: React.FC = () => {
  const { passwordErrors, validatePassword } = usePasswordValidation();
  const { validateEmail, validateName } = useFormValidation();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'lessor',
  });
  const [formErrors, setFormErrors] = useState({
    firstNameError: '',
    lastNameError: '',
    emailError: '',
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setIsError(false);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/${isLoginMode ? 'login' : 'register'}`,
        isLoginMode ? { email: formData.email, password: formData.password } : { ...formData }
      );
      setStatusMessage(isLoginMode ? 'Login successful!' : 'Registration successful!');
      // You might want to redirect the user or do some other actions here
    } catch (error: any) {
      setIsError(true);
      setStatusMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    switch (name) {
      case 'firstName':
      case 'lastName':
        setFormErrors({
          ...formErrors,
          [`${name}Error`]: validateName(value) ? '' : 'Invalid name format.'
        });
        break;
      case 'email':
        setFormErrors({ ...formErrors, emailError: validateEmail(value) ? '' : 'Invalid email address.' });
        break;
      case 'password':
        validatePassword(value);
        break;
      default:
        break;
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div className="post-listing-container">
      <h2>{isLoginMode ? 'Sign In to Post Listing' : 'Register to Post Listing'}</h2>
      {statusMessage && (
        <div className={`message ${isError ? 'error' : 'success'}`}>{statusMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
          <>
            <div className="input-group">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {formErrors.firstNameError && <div className="error-message">{formErrors.firstNameError}</div>}
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {formErrors.lastNameError && <div className="error-message">{formErrors.lastNameError}</div>}
            </div>
          </>
        )}
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {formErrors.emailError && <div className="error-message">{formErrors.emailError}</div>}
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={passwordErrors.length > 0 ? 'error-input' : ''}
          />
          {passwordErrors.length > 0 && (
            <ul className="error-message-password">
              {passwordErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="submit-button">{isLoginMode ? 'Login' : 'Register'}</button>
      </form>
      <button className="toggle-mode-button" onClick={toggleMode}>
        {isLoginMode ? 'Need to register?' : 'Already have an account?'}
      </button>
    </div>
  );
};

export default PostListing;
