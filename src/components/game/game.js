import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
  Modal,
  Pressable,
  TouchableOpacity
} from 'react-native'
import { colors, CLEAR, ENTER, copyArray, getDayOfTheYear, cache } from '../../utilities'
import Keyboard from '../Keyboard'
import { useState, useEffect } from 'react'

const NUMBER_OF_LIVES = 5
const SCORE = 0
const NUMBER_OF_LIFE_LINES = 3

const Game = ({ dataArray }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [word, setWord] = useState(dataArray[0].name)
  const [imageURL, setImageURL] = useState(dataArray[0].image)
  const [imageType, setImageType] = useState(dataArray[0].type)
  const [lives, setLives] = useState(NUMBER_OF_LIVES)
  const [score, setScore] = useState(SCORE)
  const [lifelines, setLifelines] = useState(NUMBER_OF_LIFE_LINES)
  const [modalVisible, setModalVisible] = useState(false)
  const [missingLettersUsed, setMissingLettersUsed] = useState(false)
  const [shuffleLettersUsed, setShuffleLettersUsed] = useState(false)
  const [answerTypeUsed, setAnswerTypeUsed] = useState(false)
  const [gameData, setGameData] = useState(dataArray)

  // Split word to create array of letters eg. ['h', 'e', 'l', 'l', 'o'] when the word was hello
  const [letters, setLetters] = useState(word.split(''))

  // default rows will contain an array of arrays, and every array will contain an array of cells that are filled with ''
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_LIVES).fill(new Array(letters.length).fill('')),
  )
  const [currentRow, setCurrentRow] = useState(0)
  const [currentColumn, setCurrentColumn] = useState(0)
  // Possible states won/lost/playing
  const [gameState, setGameState] = useState('playing')
  const [loaded, setLoaded] = useState(false)

  // Get the day of the year
  const dayOfTheYear = getDayOfTheYear()

  useEffect(() => {
    if (loaded) persistState()
  }, [rows, gameState, lives, currentRow, lifelines])

  useEffect(() => {
    readState()
  }, [])
  
  const persistState = async () => {
    // write all the state variables in async storage
    const data = {
      rows,
      currentRow,
      currentColumn,
      gameState,
      lives,
      score,
      word,
      imageURL,
      imageType,
      currentWordIndex,
      letters,
      lifelines,
      missingLettersUsed,
      shuffleLettersUsed,
      answerTypeUsed,
    }
    try {
      // JSON.parse(string) to get data
      const dataString = JSON.stringify(data)
      await cache.set(dayOfTheYear+"_gameState", dataString);
      await cache.set(dayOfTheYear+'_score', score);
    } catch (error) {
      console.log('Failed to write data to async storage: ', error)
    }
  }

  const readState = async () => {
    // await cache.clearAll();
    const dataString = await cache.get(dayOfTheYear+"_gameState")
    const gameDataString = await cache.get(dayOfTheYear+'_data')

    if (!dataString) {
      setLoaded(true)
      return
    }
    
    try {
      const data = JSON.parse(dataString)
      const gameData = JSON.parse(gameDataString)

      setRows(data.rows)
      setCurrentRow(data.currentRow)
      setCurrentColumn(data.currentColumn)
      setGameState(data.gameState)
      setLives(data.lives)
      setScore(data.score)
      setWord(data.word)
      setImageURL(data.imageURL)
      setImageType(data.imageType)
      setCurrentWordIndex(data.currentWordIndex)
      setLetters(data.letters)
      setGameData(gameData)
      setLifelines(data.lifelines)
      setMissingLettersUsed(data.missingLettersUsed)
      setShuffleLettersUsed(data.shuffleLettersUsed)
      setAnswerTypeUsed(data.answerTypeUsed)
      
    } catch (error) {
      console.log("Couldn't parse that state: ", error)
    }

    setLoaded(true)
  }

  const isCellActive = (row, column) => {
    return row == currentRow && column == currentColumn
  }

  // adding color feature
  const getCellBackgroundColor = (row, column) => {
    const letter = rows[row][column]
    // Set background color to black for current row and others not attempted yet
    if (row >= currentRow) {
      return colors.black
    }
    // if letter is at the correct column then background color will be green
    if (letter === letters[column]) {
      return colors.primary
    }
    // if letter in word but not right column then background color will be yellow
    else if (letters.includes(letter)) {
      return colors.secondary
    }
    // if letter not in word then background color will be darkgrey
    else {
      return colors.darkgrey
    }
  }

  const onKeyPressed = (key) => {
    if (gameState !== 'playing') return
    const updatedRows = copyArray(rows)

    if (key === '???') {
      setModalVisible(true)
      return
    }

    if (key === CLEAR) {
      const previousColumn = currentColumn - 1

      if (previousColumn >= 0) {
        updatedRows[currentRow][previousColumn] = ''
        setRows(updatedRows)
        setCurrentColumn(previousColumn)
      }
      return
    }

    if (key === ENTER) {
      // if the current column is on the last cell that means we have a full word
      if (currentColumn === rows[0].length) {
        setCurrentRow(currentRow + 1)
        setCurrentColumn(0)
      }

      return
    }

    if (currentColumn < rows[0].length) {
      updatedRows[currentRow][currentColumn] = key
      setRows(updatedRows)
      setCurrentColumn(currentColumn + 1)
    }
  }

  const getAllColorLetters = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBackgroundColor(i, j) === color),
    )
  }

  const greenCaps = getAllColorLetters(colors.primary)
  const yellowCaps = getAllColorLetters(colors.secondary)
  const greyCaps = getAllColorLetters(colors.darkgrey)

  useEffect(() => { 
    if (currentRow > 0) checkGameState()
  }, [currentRow])

  const checkGameState = () => {
    if (checkIfWon()) {
      Alert.alert('Congratualations!', 'You have guessed correctly!', [{ text: 'Next', onPress: nextImage }])
      setGameState('won')
      if (score === 0) {
        setScore(250)
      } else {
        setScore(score * 2)
      }
    } else if (checkIfLost()) {
      if(score === 0){
        Alert.alert('GAME OVER!', 'Try again tomorrow!')
      } else {
        Alert.alert('GAME OVER!', 'Score: ' + score)
      }
      setGameState('lost')
      if (lives === 0) {
        return
      } else {
        setLives(lives - 1)
      }

    } else {
      setLives(lives - 1)
    }
  }

  const checkIfWon = () => {
    const row = rows[currentRow - 1]
    return row.every((letter, i) => letter === letters[i])
  }

  const checkIfLost = () => {
    return currentRow === rows.length
  }

  const nextImage = async () => {
    setCurrentWordIndex(currentWordIndex + 1)
    setWord(gameData[currentWordIndex + 1].name)
    setImageURL(gameData[currentWordIndex + 1].image)
    setImageType(gameData[currentWordIndex + 1].type)
    setLetters(gameData[currentWordIndex + 1].name.split(''))
    setGameState('playing')
    setRows(
      new Array(lives).fill(
        new Array(gameData[currentWordIndex + 1].name.split('').length).fill(
          '',
        ),
      ),
    )
    setCurrentRow(0)
    setLoaded(true)
  }

  const missingLetters = () => {
    let greenLetters = letters.filter(
      (letter) => greenCaps.indexOf(letter) === -1,
    )
    let yellowLetters = letters.filter(
      (letter) => yellowCaps.indexOf(letter) === -1,
    )
    let missingLetters = greenLetters.filter((letter) =>
      yellowLetters.includes(letter),
    )

    Alert.alert(
      'Missing Letters',
      `${missingLetters.map((letter) => {
        return letter.toUpperCase()
      }).sort()}`,
    )

    return
  }

  const shuffleLetters = () => {
    let greenLetters = letters.filter((letter) => greenCaps.includes(letter))
    let yellowLetters = letters.filter((letter) => yellowCaps.includes(letter))
    let guessedLetters = greenLetters.concat(yellowLetters)
    guessedLetters = guessedLetters.filter(
      (item, index) => guessedLetters.indexOf(item) === index,
    )
    let guess = []

    for (let i = 0; i < letters.length; i++) {
      if (guessedLetters.includes(letters[i])) {
        guess.push(letters[i])
      } else {
        guess.push('_')
      }
    }
    Alert.alert(
      'Letters Shuffled',
      `${guess
        .map((letter) => {
          return letter.toUpperCase()
        })
        .join('')}`,
    )

    return
  }

  const answerType = () => {
    Alert.alert(
        'Answer Type',
        `${imageType}`,
      )
    return
  }

  if (!loaded) {
    return <ActivityIndicator />
  }

  return (
    <>
      <ScrollView style={styles.map}>
        <View style={styles.info}>
          <Text style={styles.infoText}>Lives: {lives}</Text>
          <Text style={styles.infoText}>Score: {score}</Text>
          <Text style={styles.infoText}>Lifelines: {lifelines}</Text>
        </View>
        <Image
          source={{
            uri: imageURL,
          }}
          style={styles.image}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.')
            setModalVisible(!modalVisible)
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Text style={{width: 100, textAlign: 'right'}}>X</Text>
            </TouchableOpacity>
              <Text style={styles.modalText}>Lifelines!</Text>
              <Pressable
                disabled={missingLettersUsed}
                style={[
                  styles.button,
                  {
                    backgroundColor: !missingLettersUsed
                      ? '#2196F3'
                      : colors.darkgrey,
                  },
                ]}
                onPress={() => {
                  setMissingLettersUsed(true)
                  setLifelines(lifelines - 1)
                  setModalVisible(!modalVisible)
                  missingLetters()
                }}
              >
                <Text style={styles.textStyle}>Missing Letters</Text>
              </Pressable>
              <Pressable
                disabled={shuffleLettersUsed}
                style={[
                  styles.button,
                  {
                    backgroundColor: !shuffleLettersUsed
                      ? '#2196F3'
                      : colors.darkgrey,
                  },
                ]}
                onPress={() => {
                  setShuffleLettersUsed(true)
                  setModalVisible(!modalVisible)
                  setLifelines(lifelines - 1)
                  shuffleLetters()
                }}
              >
                <Text style={styles.textStyle}>Shuffle Letters</Text>
              </Pressable>
              <Pressable
                disabled={answerTypeUsed}
                style={[
                  styles.button,
                  {
                    backgroundColor: !answerTypeUsed
                      ? '#2196F3'
                      : colors.darkgrey,
                  },
                ]}
                onPress={() => {
                  setAnswerTypeUsed(true)
                  setModalVisible(!modalVisible)
                  setLifelines(lifelines - 1)
                  answerType()
                }}
              >
                <Text style={styles.textStyle}>Answer Type</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {rows.map((row, row_key) => (
          <View key={row_key} style={styles.row}>
            {row.map((cell, cell_key) => (
              <View
                key={cell_key}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(row_key, cell_key)
                      ? colors.lightgrey
                      : colors.darkgrey,
                    backgroundColor: getCellBackgroundColor(row_key, cell_key),
                  },
                ]}
              >
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </>
  )
}

const styles = StyleSheet.create({
  map: {
    alignSelf: 'stretch',
    marginVertical: 10,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    margin: 3,
    borderWidth: 4,
    borderColor: colors.darkgrey,
    flex: 1,
    aspectRatio: 1,
    maxWidth: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
    fontSize: 28,
  },
  image: {
    height: Dimensions.get('window').width,
    maxHeight: 750,
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  infoText: {
    color: colors.lightgrey,
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalHeaderCloseText: {
    // textAlign: "right",
    paddingLeft: 5,
    paddingRight: 5
  }
})

export default Game
