import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyBv2EplLqne6Bg67S2TGsmpGoEc03n5d7A",
    authDomain: "hirakata-romanji-typing-check.firebaseapp.com",
    projectId: "hirakata-romanji-typing-check",
    storageBucket: "hirakata-romanji-typing-check.appspot.com",
    messagingSenderId: "317079133258",
    appId: "1:317079133258:web:da21fa88f4427d0eb11ab3",
    measurementId: "G-3B7VRDTXF3"
}

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth
export const db = firebase.database()