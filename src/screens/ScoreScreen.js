import { Text, SafeAreaView, Pressable, StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import { getDayOfTheYear, cache } from '../utilities'
import Score from '../components/score'
import { colors } from '../utilities'
import { useIsFocused } from "@react-navigation/native";

const ScoreScreen = ({navigation}) => {
    const [scores, setScores] = useState({})
    const isFocused = useIsFocused();

    const highscores = async () => {
      // For loop to retrieve all the scores
      for (i = 1; i < 366; i++) {
        try {
          // await cache.clearAll();
          const score = await cache.get(i+'_score')
          const newScores = {[i]: score}
          // Only add the score if it is not null
          if(score) setScores({...scores, ...newScores})

        } catch (error) {
          console.log('Failed to write data to async storage: ', error)
        }
      }
    }

    useEffect(() => {
      highscores()
    }, [isFocused])

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <Pressable
          onPress={() => {
            navigation.navigate('HomeScreen', {
                screen: 'home',
                title: 'GeoWord',
              })
          }}
        >
          <Text style={styles.title}>GeoWord</Text>
        </Pressable>
        <Text style={styles.subTitle}>High Scores</Text>
        <Score scores={Object.values(scores).sort((a,b)=>b-a).slice(0,10)} />
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