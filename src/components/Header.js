import '../styles/Header.css';
import logo from '../media/alien.png';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Link } from 'react-router-dom';

const Header = (props) => {

  const logOut = () => {
    firebase.auth().signOut().then(() => {
      props.setUser(null);
    });
  };
  
  return (
    <div className='header'>
      <Link className='page-title' to='/'>
          <img className='logo' alt='logo' src={logo} />
          readit
      </Link>
      <div className='buttons'>
        {!props.user && <Link to='/login'><button className='login-btn btn'>Login</button></Link>}
        {props.user && <span className='user-name'>{props.user.displayName}</span>}
        {props.user && <Link to='/'><button onClick={logOut}className='log-out-btn btn'>Log out</button></Link>}
        {!props.user && <Link to='/signup'><button className='sign-up-btn btn'>Sign up</button></Link>}
      </div>
    </div>
  );
};

export default Header;