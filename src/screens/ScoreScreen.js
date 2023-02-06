import { Text, SafeAreaView, Pressable, StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import { getDayOfTheYear, cache } from '../utilities'
import Score from '../components/score'
import { colors } from '../utilities'

const ScoreScreen = ({navigation}) => {
    const [scores, setScores] = useState([22, 100, 40, 123, 13, 1, 0, 22, 33, 40, 1002, 429])
    // Get the day of the year
    const dayOfTheYear = getDayOfTheYear()

    const highscores = async () => {
      // For loop to retrieve all the scores
      for (i = 1; i < 366; i++) {
        try {
          
          const score = await cache.get(i+'_score')
          // Only add the score if it is not null
          if(score) setScores(scores => [...scores, score])

        } catch (error) {
          console.log('Failed to write data to async storage: ', error)
        }
      }
    }

    useEffect(() => {
      highscores()
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
        <Text style={styles.subTitle}>High Scores</Text>
        <Score scores={scores.sort((a,b)=>b-a).slice(0,10)} />
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
  subTitle: {
    color: colors.lightgrey,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 7,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
})

export default ScoreScreen