import './styles/index.css';
import './styles/reset.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from 'firebase/app';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDrSeIcoMoV-mP6jJy_j0oOIueeaEmTLbQ",
  authDomain: "readit-c4bfd.firebaseapp.com",
  projectId: "readit-c4bfd",
  storageBucket: "readit-c4bfd.appspot.com",
  messagingSenderId: "684668365048",
  appId: "1:684668365048:web:6d6c902edc5fbb1aaf730d"
});

let posts = {};
let comments = {};
let groups = {};

  // Get all posts
firebase.firestore().collection('posts').get().then((querySnapShot) => {
  querySnapShot.forEach((x) => {
    posts[x.id] = x.data();
  });
});

  // Get all comments
firebase.firestore().collection('comments').get().then((querySnapShot) => {
  querySnapShot.forEach((x) => {
    comments[x.id] = x.data();
  });
});

  // Get all groups (don't love the object structure)
firebase.firestore().collection('groups').get().then((querySnapShot) => {
  querySnapShot.forEach(x => {
    groups[x.id] = {
      description: x.data().description
    };
  });
});


ReactDOM.render(
  <React.StrictMode>
    <App posts={posts} groups={groups} comments={comments} />
  </React.StrictMode>,
  document.getElementById('root')
);