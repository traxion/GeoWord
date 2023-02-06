import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyA8isUWevqp7rlhkUbFLBlTYG7SLBw8vY4',
  authDomain: 'movienight-70c8f.firebaseapp.com',
  projectId: 'movienight-70c8f',
  storageBucket: 'movienight-70c8f.appspot.com',
  messagingSenderId: '1054617233398',
  appId: '1:1054617233398:web:9f56d11455b708efac49d7',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const db = firebase.firestore()
const auth = firebase.auth()

export { firebase, auth, db }
