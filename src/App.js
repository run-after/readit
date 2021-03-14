import './styles/App.css';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Feed from './components/Feed';
import User from './components/User';
import Group from './components/Group';
import Groups from './components/Groups';
import { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/firestore';

function App() {

  let initialUser;

  if (sessionStorage.length < 1) {
    initialUser = null;
  } else {
    initialUser = JSON.parse(sessionStorage[Object.keys(sessionStorage)[0]]);
  };

  const [user, setUser] = useState(initialUser);
  const [userRef, setUserRef] = useState(null);
  const [allPosts, setAllPosts] = useState(null);
  const [allGroups, setAllGroups] = useState(null);
  const [allComments, setAllComments] = useState(null);

  useEffect(() => {
    if (user) {
      firebase.firestore().collection('users').doc(user.displayName).get().then((doc) => {
        setUserRef(doc.data());
      });
    };
  }, [user]);

  useEffect(() => {
    // Get all posts
    firebase.firestore().collection('posts').get().then((querySnapShot) => {
      let tempPosts = {};
      querySnapShot.forEach((x) => {
        tempPosts[x.id] = x.data();
      });
      setAllPosts(tempPosts);
    });

    // Get all comments
    firebase.firestore().collection('comments').get().then((querySnapShot) => {
      let tempComments = {};
      querySnapShot.forEach((x) => {
        tempComments[x.id] = x.data();
      });
      setAllComments(tempComments);
    });

    // Get all groups (don't love the object structure)
    firebase.firestore().collection('groups').get().then((querySnapShot) => {
      let tempGroups = [];
      querySnapShot.forEach((x) => {
        tempGroups.push(x.id);
      });
      setAllGroups(tempGroups);
    });

  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Header user={user} setUser={setUser} userRef={userRef}/>
        <Switch>
          <Route exact path='/' render={() => <Feed userRef={userRef} posts={allPosts} setAllPosts={setAllPosts} groups={allGroups} />} />
          <Route exact path='/login' render={() => <Login user={user} setUser={setUser} />} />
          <Route exact path='/signup' render={() => <SignUp user={user} setUser={setUser} setUserRef={setUserRef} />} />
          <Route exact path='/user/:name' render={() => <User user={user} userRef={userRef} />} />
          <Route exact path='/groups/:group' render={() => <Group user={user} userRef={userRef} groups={allGroups} posts={allPosts}/>} />
          <Route exact path='/groups' render={() => <Groups user={user} setUserRef={setUserRef} />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

/*
  Work in Feed

  Don't love allGroups object structure

  Make unfound route go to 404

  Remove link from Header with name. When on a different user page, it doesn't update info

  Maybe move group list from header to right margin to fill space???

  Maybe, when first making a post or a comment, it's upvoted by you right away

  Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
  ^ To fix, try to move the post retrieving from feed to App. Then it only does it once.
*/