import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter } from 'react-router-dom'
import * as firebase from 'firebase/app'
import 'firebase/database'
import { SdkUtils } from '@utils'
import { Client, ContextWrapper } from '@tools'
import Routers from '@routers'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyAzni8DvqLlDB_rnt1nxtCpIEeHocXHaZA',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'graduation-project-2020.firebaseapp.com',
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://graduation-project-2020.firebaseio.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'graduation-project-2020',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'graduation-project-2020.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '950930789819',
  appId: process.env.FIREBASE_APP_ID || '1:950930789819:web:b54a53c02ebdcf7e59609e',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-MPT0K7B144'
}

if (!firebase.apps?.length) {
  firebase.initializeApp(firebaseConfig)
}
const App = () => {
  // firebase.initializeApp(firebaseConfig)
  SdkUtils.initFacebookSdk()
  SdkUtils.initGooglePlatform()
  return (
    <ApolloProvider client={Client}>
      <BrowserRouter>
        <ContextWrapper>
          <Routers />
        </ContextWrapper>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
