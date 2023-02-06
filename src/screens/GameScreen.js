import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, SafeAreaView, Platform, Pressable } from 'react-native'
import { colors, shuffle, getDayOfTheYear, cache } from '../utilities'
import Game from '../components/game/game'
import { useEffect } from 'react'

const GameScreen = ({navigation}) => {
    const data = require('../components/data/data.json')
    const dataArray = shuffle(data)  

    // Get the day of the year
    const dayOfTheYear = getDayOfTheYear()

    // Clear cache on the first of January
    if (dayOfTheYear === 1) {
        cache.clearAll();
    }

    const gameData = async () => {
      // Get the data from the cache
      const cachedData = await cache.get(dayOfTheYear+'_data')

      try {
        // JSON.parse(string) to get data
        const dataString = JSON.stringify(dataArray)
        
        // If the data is not in the cache, then add it
        if (!cachedData) {
          cache.set(dayOfTheYear+'_data', dataString)
        }
      } catch (error) {
        console.log('Failed to write data to async storage: ', error)
      }
    }

    useEffect(() => {
      gameData()
    }, [])
    

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <Pressable
          onPress={() => {
            console.log('pressed play')
            navigation.navigate('HomeScreen', {
                screen: 'home',
                title: 'GeoWord',
              })
          }}
        >
          <Text style={styles.title}>GeoWord</Text>
        </Pressable>
        <Game dataArray={dataArray} />
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.black,
      alignItems: 'center',
    },
    title: {
      color: colors.lightgrey,
      fontSize: 32,
      fontWeight: 'bold',
      letterSpacing: 7,
      marginTop: Platform.OS === 'android' ? 30 : 0,
    },
  })

export default GameScreen


