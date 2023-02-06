import { Cache } from "react-native-cache";
import AsyncStorage from '@react-native-async-storage/async-storage'

export const colors = {
  black: '#121214',
  darkgrey: '#3A3A3D',
  grey: '#818384',
  lightgrey: '#D7DADC',
  primary: '#538D4E',
  secondary: '#B59F3B',
}

export const colorsToEmoji = {
  [colors.darkgrey]: '⬛',
  [colors.primary]: '🟩',
  [colors.secondary]: '🟧',
}

export const ENTER = 'ENTER'
export const CLEAR = 'CLEAR'

export const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  [ENTER, 'z', 'x', 'c', 'v', 'b', 'n', 'm', CLEAR],
  ['???']
]

export const copyArray = (array) => {
  return [...array.map((rows) => [...rows])]
}

export const shuffle = (array) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Function to get the day of the year
export const getDayOfTheYear = () => {
  const now = new Date();
  // January 1st
  const start = new Date(now.getFullYear(), 0, 0);
  // Difference in milliseconds
  const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;
  // Calculate the day of the year
  const day = Math.floor(diff / oneDay);
  return day;
}

// Create a new cache instance
export const cache = new Cache({
  namespace: "myapp",
  policy: {
      maxEntries: 50000, // if unspecified, it can have unlimited entries
      stdTTL: 0 // the standard ttl as number in seconds, default: 0 (unlimited)
  },
  backend: AsyncStorage
});
