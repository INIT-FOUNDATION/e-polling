import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { LogLevel } from '../types/globalTypes';

interface LoggerContextType {
  setLogLevel: (level: LogLevel) => void;
  log: (level: LogLevel, message: string, ...args: any[]) => void;
}

export const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

const levelPriority: { [key in LogLevel]: number } = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
};

export const LoggerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState<LogLevel>('info');

  const setLogLevel = useCallback((level: LogLevel) => {
    setCurrentLevel(level);
  }, []);

  const log = useCallback((level: LogLevel, message: string, ...args: any[]) => {
    if (levelPriority[level] >= levelPriority[currentLevel]) {
      switch (level) {
        case 'debug':
          console.debug(message, ...args);
          break;
        case 'info':
          console.info(message, ...args);
          break;
        case 'warn':
          console.warn(message, ...args);
          break;
        case 'error':
          console.error(message, ...args);
          break;
        default:
          console.log(message, ...args);
      }
    }
  }, [currentLevel]);

  return (
    <LoggerContext.Provider value={{ setLogLevel, log }}>
      {children}
    </LoggerContext.Provider>
  );
};