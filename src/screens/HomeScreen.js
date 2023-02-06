import {
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  View,
  Pressable,
  Image,
  Dimensions
} from 'react-native'
import React from 'react'
import { colors } from '../utilities'
import { StatusBar } from 'expo-status-bar'
const HomeScreen = ({navigation}) => {
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
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Flag-map_of_the_world_%282017%29.png',
          }}
          style={styles.image}
        />
      <View style={styles.menu}>
        <Pressable
          onPress={() => {
            navigation.navigate('GameScreen', {
                screen: 'game',
                title: 'GeoWord',
              })
          }}
        >
          <Text style={styles.menuItem}>Play</Text>
        </Pressable>
        <Text style={styles.menuItem}>Settings</Text>
        <Text style={styles.menuItem}>About</Text>
        <Pressable
          onPress={() => {
            navigation.navigate('ScoreScreen', {
                screen: 'score',
                title: 'GeoWord',
              })
          }}
        >
          <Text style={styles.menuItem}>High Score</Text>
        </Pressable>
      </View>
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
  menu: {
    flex: 1,
    justifyContent: 'center',         
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  menuItem: {
    color: colors.lightgrey,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 7,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  image: {
    height: Dimensions.get('window').width,
    maxHeight: 750,
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
})

export default HomeScreen
