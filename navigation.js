import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './src/screens/HomeScreen'
import GameScreen from './src/screens/GameScreen'
import ScoreScreen from './src/screens/ScoreScreen'
import { AppProvider } from './src/context/AppContext'

const Stack = createStackNavigator()

export const SignedInStack = () => (
  <AppProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ScoreScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GameScreen"
          component={GameScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScoreScreen"
          component={ScoreScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </AppProvider>
)
