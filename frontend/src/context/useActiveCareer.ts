import { useContext } from 'react';
import { ActiveCareerContext } from './ActiveCareerContext';

export function useActiveCareer() {
  const context = useContext(ActiveCareerContext);

  if (!context) {
    throw new Error('useActiveCareer must be used within ActiveCareerProvider');
  }

  return context;
}
