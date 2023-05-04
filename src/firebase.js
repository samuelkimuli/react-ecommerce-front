// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const config = {
  apiKey: "AIzaSyCfXpwbrU5lllBd1ycI9CynRset7fh7aUI",
  authDomain: "react-ecommerce-app-ae42e.firebaseapp.com",
  projectId: "react-ecommerce-app-ae42e",
  storageBucket: "react-ecommerce-app-ae42e.appspot.com",
  messagingSenderId: "993490326625",
  appId: "1:993490326625:web:86df1894f5d5aaaa448620"
};

// Initialize Firebase
if(!firebase.apps.length){
    firebase.initializeApp(config);
}

// export
// export default firebase;
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
