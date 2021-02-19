import './styles/App.css';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Groups from './components/Groups';
import Feed from './components/Feed';
import { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Header user={user} setUser={setUser} />
        <Switch>
          <Route exact path='/' render={() => <Feed user={user} />} />
          <Route exact path='/groups' component={Groups} />
          <Route exact path='/login' render={() => <Login user={user} setUser={setUser} />} />
          <Route exact path='/signup' render={() => <SignUp user={user} setUser={setUser} />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
