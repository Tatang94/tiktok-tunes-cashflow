// Clear all demo data from localStorage
export const clearAllDemoData = () => {
  // Clear specific demo data keys
  localStorage.removeItem('demoReferralCount');
  localStorage.removeItem('referralData');
  localStorage.removeItem('demoCreatorData');
  localStorage.removeItem('sampleSongs');
  localStorage.removeItem('mockCreator');
  
  // Clear any keys that might contain demo data
  const keysToCheck = Object.keys(localStorage);
  keysToCheck.forEach(key => {
    if (key.includes('demo') || key.includes('sample') || key.includes('mock')) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('All demo data cleared from localStorage');
};

// Call this function to force clean state
clearAllDemoData();