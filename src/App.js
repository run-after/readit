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
  const [allPosts, setAllPosts] = useState(props.posts);
  const [allGroups, setAllGroups] = useState(props.groups);
  const [allComments, setAllComments] = useState(props.comments);

  useEffect(() => {
    if (user) {
      firebase.firestore().collection('users').doc(user.displayName).get().then((doc) => {
        setUserRef(doc.data());
      });
    };
  }, [user]);

  return (
    <div className="App">
      <BrowserRouter>
        <Header user={user} setUser={setUser} userRef={userRef}/>
        <Switch>
          <Route exact path='/' render={() => <Feed userRef={userRef} allPosts={allPosts} setAllPosts={setAllPosts} allGroups={allGroups} allComments={allComments}/>} />
          <Route exact path='/login' render={() => <Login user={user} setUser={setUser} />} />
          <Route exact path='/signup' render={() => <SignUp user={user} setUser={setUser} setUserRef={setUserRef} />} />
          <Route exact path='/user/:name' render={() => <User user={user} userRef={userRef} />} />
          <Route exact path='/groups/:group' render={() => <Group userRef={userRef} setUserRef={setUserRef} allGroups={allGroups} allPosts={allPosts} setAllPosts={setAllPosts} allComments={allComments}/>} />
          <Route exact path='/groups' render={() => <Groups userRef={userRef} user={user} setUserRef={setUserRef} allGroups={allGroups} />} />
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