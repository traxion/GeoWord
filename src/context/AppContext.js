import React, { useState } from 'react'

const AppContext = React.createContext()

export const AppProvider = ({ children }) => {
  const [loggedInState, setLoggedInState] = useState('')

  return (
    <AppContext.Provider value={{ loggedInState, setLoggedInState }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
