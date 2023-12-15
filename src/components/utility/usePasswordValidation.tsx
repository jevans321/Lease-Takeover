import { useState } from 'react';

const usePasswordValidation = () => {
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    let errors: string[] = [];
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long.`);
    }
    if (!hasUppercase) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!hasLowercase) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    if (!hasNumber) {
      errors.push('Password must contain at least one number.');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character.');
    }

    setPasswordErrors(errors);
  };

  return { passwordErrors, validatePassword };
};

export default usePasswordValidation;
