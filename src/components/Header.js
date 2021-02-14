import '../styles/Header.css';
import moon from '../media/moon.png';
import logo from '../media/alien.png';

const Header = () => {
  
  return (
    <div className='header'>
      <img className='logo' alt='logo' src={logo} />
      <div className='buttons'>
        <button className='login-btn btn'>Login</button>
        <button className='sign-up-btn btn'>Sign up</button>
      </div>
      <button className='night-mode'><img src={moon} /></button>
      
    </div>
  );
};

export default Header;