import './styles/App.css';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Feed from './components/Feed';
import User from './components/User';
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
          <Route exact path='/login' render={() => <Login user={user} setUser={setUser} />} />
          <Route exact path='/signup' render={() => <SignUp user={user} setUser={setUser} />} />
          <Route exact path='/user/:name' render={() => <User />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

// User page: 
// Show users comments (with comment info)
// Show users posts (with post info) --- done

// Make groups page

// Make feed show all posts --- I think this is done

// Make unfound route go to 404

// Modify up/down arrows to be transparent in center and adjust background
// to make change color if clicked.

// Need to set up session storage