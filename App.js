import React from 'react'
import 'react-native-gesture-handler'
import { LogBox } from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { SignedInStack } from './navigation'

export default function App() {
  LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core'])

  return (
      <MenuProvider>
          <SignedInStack />
      </MenuProvider>
  )
}
