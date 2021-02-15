import './styles/index.css';
import './styles/reset.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from 'firebase/app';

firebase.initializeApp({
  apiKey: "AIzaSyDrSeIcoMoV-mP6jJy_j0oOIueeaEmTLbQ",
  authDomain: "readit-c4bfd.firebaseapp.com",
  projectId: "readit-c4bfd",
  storageBucket: "readit-c4bfd.appspot.com",
  messagingSenderId: "684668365048",
  appId: "1:684668365048:web:6d6c902edc5fbb1aaf730d"
});


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);