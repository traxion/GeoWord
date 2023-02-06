import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { colors } from '../utilities'
import { Divider } from 'react-native-elements'

const Score = ({ scores }) => {
  return (
    <ScrollView style={styles.map}>
      {scores.map((score, index) => (
        <View key={index}>
          <Divider
            width={1}
            orientation={'vertical'}
            style={{ marginTop: 8 }}
          />
          <Text style={styles.score}>
            {score}
          </Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    map: {
        alignSelf: 'stretch',
        marginVertical: 10,
      },
  container: {
    flex: 1,
    width: '80%',
    backgroundColor: colors.darkgrey,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  score: {
    color: colors.lightgrey,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 7,
    textAlign: 'center',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
})

export default Score
