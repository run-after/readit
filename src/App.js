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
console.log(userRef)
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
          <Route exact path='/' render={() => <Feed user={user} userRef={userRef} />} />
          <Route exact path='/login' render={() => <Login user={user} setUser={setUser} />} />
          <Route exact path='/signup' render={() => <SignUp user={user} setUser={setUser} setUserRef={setUserRef} />} />
          <Route exact path='/user/:name' render={() => <User user={user} userRef={userRef} />} />
          <Route exact path='/groups/:group' render={() => <Group user={user} />} />
          <Route exact path='/groups' render={() => <Groups user={user} setUserRef={setUserRef} />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

/*

  Work to be done in Group.js

  Make unfound route go to 404

  Button on right margin of Feed to make new pic post doesn't work

  Remove link from Header with name. When on a different user page, it doesn't update info

  Maybe move group list from header to right margin to fill space???

  Maybe, when first making a post or a comment, it's upvoted by you right away
*/