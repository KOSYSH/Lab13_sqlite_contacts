import React, { createContext, useState, useContext } from 'react';

const ContactContext = createContext({refresh: () => {}, refreshKey: 0});

export const ContactProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey(k => k + 1);
  return (
    <ContactContext.Provider value={{refresh, refreshKey}}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => useContext(ContactContext);
