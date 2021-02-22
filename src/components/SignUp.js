import '../styles/SignUp.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Redirect } from 'react-router-dom';

const SignUp = (props) => {

  if (props.user) {
    return <Redirect to='/' />;
  };
  
  let user;

  const checkIfUniqueUserName = (name) => {
    let arr = [];
    return firebase.firestore().collection('users').get().then((querySnapShot) => {
      querySnapShot.docs.forEach((doc) => {
        arr.push(doc.data().displayName.toLowerCase());
      });
    }).then(() => {
      return !arr.includes(name);
    })
  };

  const makeAccount = (e) => {
    e.preventDefault();
    const form = document.querySelector('.sign-up-form');
    const displayName = form[0].value;
    const email = form[1].value;
    const password = form[2].value;

    checkIfUniqueUserName(displayName.toLowerCase()).then((result) => {
      if (result) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            user = userCredential.user;
            user.updateProfile({
              displayName: displayName
            }).then(()=> {
              firebase.firestore().collection('users').doc(displayName).set({
                displayName: displayName,
                email: email,
                groups: []
              });
              props.setUser(user);
            }).catch(function(error) {
              console.log(error);
            });
        }).catch((error) => {
          const warning = form.querySelector('.warning');
          warning.textContent = error.message;
        });
      } else {
        const warning = form.querySelector('.warning');
        warning.textContent = 'User name already exists';
      };
    });  
  };
  
  return (
    
    <form className='sign-up-form' onSubmit={makeAccount}>
      <p className='warning'></p>
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