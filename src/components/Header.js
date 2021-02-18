import '../styles/Header.css';
import moon from '../media/moon.png';
import logo from '../media/alien.png';
import firebase from 'firebase/app';
import 'firebase/auth';

const Header = (props) => {

  const showLogin = () => {
    const form = document.querySelector('.login-form');
    form.style = 'display: flex;'
  };

  const showSignUp = () => {
    const form = document.querySelector('.sign-up-form');
    form.style = 'display: flex';
  };

  const logOut = () => {
    firebase.auth().signOut().then(() => {
      props.setUser(null);
    });
  };
  
  return (
    <div className='header'>
      <div className='page-title'>
        <img className='logo' alt='logo' src={logo} />
        readit
      </div>
      <div className='buttons'>
        {!props.user && <button onClick={showLogin} className='login-btn btn'>Login</button>}
        {props.user && <button onClick={logOut}className='log-out-btn btn'>Log out</button>}
        {!props.user && <button onClick={showSignUp} className='sign-up-btn btn'>Sign up</button>}
      </div>
      <button className='night-mode'><img alt='moon' src={moon} /></button>
      
    </div>
  );
};

export default Header;