import React, { createContext, useState } from 'react';
import { Loader } from '@mantine/core';

interface LoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

export const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
      {isLoading && <Loader color='blue' size={30} />}
    </LoaderContext.Provider>
  );
};
