export const useFormValidation = () => {
  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email.toLowerCase());
  };

  const validateName = (name: string): boolean => {
    // Allows letters, spaces, hyphens, and apostrophes
    console.log('name: ', name, name.length)
    const re = /^[a-zA-Z\s'-]+$/;
    return re.test(name) && name.trim().length > 0;
  };

  return {
    validateEmail,
    validateName,
  };
};
