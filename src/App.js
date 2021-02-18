import './styles/App.css';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { useState } from 'react';

function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <Header user={user} setUser={setUser} />
      <Login setUser={setUser} />
      <SignUp setUser={setUser} />
    </div>
  );
}

export default App;
