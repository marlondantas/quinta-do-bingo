import { useState, useEffect } from 'react';

export function usePrivacyConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const accepted = localStorage.getItem('bingo-privacy-accepted');
    const declined = localStorage.getItem('bingo-privacy-declined');
    
    if (accepted) {
      setHasConsent(true);
    } else if (declined) {
      setHasConsent(false);
    } else {
      setHasConsent(null); // Ainda não decidiu
    }
  }, []);

  return hasConsent;
}