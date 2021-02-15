import './styles/App.css';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { useState } from 'react';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Login setLoggedIn={setLoggedIn} />
      <SignUp setLoggedIn={setLoggedIn} />
    </div>
  );
}

export default App;
