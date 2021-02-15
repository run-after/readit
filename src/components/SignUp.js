import '../styles/SignUp.css';
import firebase from 'firebase/app';
import 'firebase/auth';

const SignUp = (props) => {
  
  let user;

  const makeAccount = (e) => {
    e.preventDefault();
    const form = document.querySelector('.sign-up-form');
    firebase.auth().createUserWithEmailAndPassword(form[1].value, form[2].value)
      .then((userCredential) => {
        user = userCredential.user;
        user.updateProfile({
          displayName: form[0].value
        }).then(function () {
          props.setLoggedIn(true);
          form.style = 'display: none;'
        }).catch(function(error) {
          console.log(error);
        });

    }).catch((error) => {
      const p = form.querySelector('p');
      p.textContent = error.message;
    });
  };
  
  return (
    
    <form className='sign-up-form' onSubmit={makeAccount}>
      <p></p>
      <label>Display Name</label>
      <input name='displayName' type='text' required />
      <label>Email</label>
      <input name='email' type='email' required />
      <label>Password</label>
      <input name='password' type='password' minLength='6' required/>
      <button className='btn' type='submit'>Create Account</button>
    </form>
    
  );
};

export default SignUp;