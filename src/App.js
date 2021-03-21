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

function App(props) {

  let initialUser;

  if (sessionStorage.length < 1) {
    initialUser = null;
  } else {
    initialUser = JSON.parse(sessionStorage[Object.keys(sessionStorage)[0]]);
  };

  const [user, setUser] = useState(initialUser);
  const [userRef, setUserRef] = useState(null);
  const [allPosts, setAllPosts] = useState({});
  const [allGroups, setAllGroups] = useState({});
  const [allComments, setAllComments] = useState({});

  useEffect(() => {
    if (user) {
      firebase.firestore().collection('users').doc(user.displayName).get().then((doc) => {
        setUserRef(doc.data());
      });
    };
  }, [user]);

  useEffect(() => {
    let posts = {};
    let comments = {};
    let groups = {};
    // Get all posts from DB
    firebase.firestore().collection('posts').get().then((querySnapShot) => {
      querySnapShot.forEach((x) => {
        posts[x.id] = x.data();
      });
      setAllPosts(posts);
    });

    // Get all comments from DB
    firebase.firestore().collection('comments').get().then((querySnapShot) => {
      querySnapShot.forEach((x) => {
        comments[x.id] = x.data();
      });
      setAllComments(comments);
    });

    // Get all groups from DB
    firebase.firestore().collection('groups').get().then((querySnapShot) => {
      querySnapShot.forEach(x => {
        groups[x.id] = {
          description: x.data().description
        };
      });
      setAllGroups(groups);
    });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header user={user} setUser={setUser} userRef={userRef} />
        <Switch>
          <Route exact path='/' render={() => <Feed
            userRef={userRef}
            allPosts={allPosts}
            setAllPosts={setAllPosts}
            allGroups={allGroups}
            allComments={allComments}
            setAllComments={setAllComments}
          />} />
          <Route exact path='/login' render={() => <Login
            user={user}
            setUser={setUser}
          />} />
          <Route exact path='/signup' render={() => <SignUp
            user={user}
            setUser={setUser}
            setUserRef={setUserRef}
          />} />
          <Route exact path='/user/:name' render={() => <User
            userRef={userRef}
            setUserRef={setUserRef}
            allPosts={allPosts}
            setAllPosts={setAllPosts}
            allComments={allComments}
            setAllComments={setAllComments}
          />} />
          <Route exact path='/groups/:group' render={() => <Group
            userRef={userRef}
            setUserRef={setUserRef}
            allGroups={allGroups}
            allPosts={allPosts}
            setAllPosts={setAllPosts}
            allComments={allComments}
            setAllComments={setAllComments}
          />} />
          <Route exact path='/groups' render={() => <Groups
            userRef={userRef}
            setUserRef={setUserRef}
            allGroups={allGroups}
          />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;

/*
  Work in Feed

  Don't love allGroups object structure

  Make unfound route go to 404

  Remove link from Header with name. When on a different user page, it doesn't update info

  Maybe move group list from header to right margin to fill space???

  Maybe, when first making a post or a comment, it's upvoted by you right away
*/