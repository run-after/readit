import '../styles/Login.css';
import firebase from 'firebase/app';
import 'firebase/auth';

const Login = (props) => {

  const signIn = (e) => {
    e.preventDefault();
    const form = document.querySelector('.login-form');

    firebase.auth().signInWithEmailAndPassword(form[0].value, form[1].value)
      .then(() => {
        form.style = 'display: none;';
        props.setLoggedIn(true);
      }).catch((error) => {
        const p = form.querySelector('p');
        p.textContent = error.message;
      });
  };

  return (
    <form className='login-form' onSubmit={signIn}>
      <p></p>
      <label>Email</label>
      <input name='email' type='email' required />
      <label>Password</label>
      <input name='password' type='password' required/>
      <button className='btn' type='submit'>Login</button>
    </form>
  );
};

export default Login;