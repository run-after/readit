import './styles/App.css';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Feed from './components/Feed';
import User from './components/User';
import Group from './components/Group';
import Groups from './components/Groups';
import { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() { 

  let initialUser;

  if (sessionStorage.length < 1) {
    initialUser = null;
  } else {
    initialUser = JSON.parse(sessionStorage[Object.keys(sessionStorage)[0]]);
  };

  const [user, setUser] = useState(initialUser);

  return (
    <div className="App">
      <BrowserRouter>
        <Header user={user} setUser={setUser} />
        <Switch>
          <Route exact path='/' render={() => <Feed user={user} />} />
          <Route exact path='/login' render={() => <Login user={user} setUser={setUser} />} />
          <Route exact path='/signup' render={() => <SignUp user={user} setUser={setUser} />} />
          <Route exact path='/user/:name' render={() => <User />} />
          <Route exact path='/groups/:group' render={() => <Group user={user} />} />
          <Route exact path='/groups' render={() => <Groups user={user} />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

/*
  Make unfound route go to 404

  Up/down vote arrows need to be able to turn color

  Button on right margin to make new pic post doesn't work

  Maybe move group list from header to right margin to fill space???
*/