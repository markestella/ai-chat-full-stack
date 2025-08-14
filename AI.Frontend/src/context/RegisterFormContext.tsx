import React, { createContext, useContext, useState } from 'react';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormContextType {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
}

const RegisterFormContext = createContext<RegisterFormContextType | undefined>(undefined);

export const RegisterFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  return (
    <RegisterFormContext.Provider value={{ formData, setFormData }}>
      {children}
    </RegisterFormContext.Provider>
  );
};

export const useRegisterForm = () => {
  const context = useContext(RegisterFormContext);
  if (!context) {
    throw new Error("useRegisterForm must be used within a RegisterFormProvider");
  }
  return context;
};
