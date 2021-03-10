import '../styles/Login.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Redirect } from 'react-router-dom';

const Login = (props) => {

  if (props.user) {
    return <Redirect to='/' />;
  };

  const signIn = (e) => {
    e.preventDefault();
    const form = e.target;
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      firebase.auth().signInWithEmailAndPassword(form[0].value, form[1].value)
        .then((userCredential) => {
          props.setUser(userCredential.user);
      }).catch((error) => {
        const warning = form.querySelector('.warning');
        warning.textContent = error.message;
      });
    })
    .catch((error) => {
      console.log(error);
    });
  };
    
  return (
    <form className='login-form' onSubmit={signIn}>
      <p className='warning'></p>
      <label>Email</label>
      <input name='email' type='email' required />
      <label>Password</label>
      <input name='password' type='password' required/>
      <button className='btn' type='submit'>Login</button>
    </form>
  );
};

export default Login;