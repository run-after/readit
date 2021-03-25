import '../styles/SignUp.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Redirect } from 'react-router-dom';
import userFactory from '../scripts/userFactory';
import { useState } from 'react';

const SignUp = (props) => {

  const [warningMessage, setWarningMessage] = useState(null);
  
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

  const checkCharacters = (e) => {
    const button = document.querySelector('.submit-btn');
    if (e.target.value.includes(' ')) {
      setWarningMessage('Username cannot contain spaces');
      button.disabled = true;
    } else {
      setWarningMessage(null);
      button.disabled = false;
    };
  };

  const makeAccount = (e) => {
    e.preventDefault();
    const form = e.target;
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
            }).then(() => {
              props.setUser(user);
            });
          }).then(() => {
            const newUser = userFactory(displayName, email);
            props.setUserRef(newUser);
            firebase.firestore().collection('users').doc(displayName)
              .set(newUser);
            console.log('new user')
          }).then(() => {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
          }).catch(function (error) {
            setWarningMessage(error.message);
          });
      } else {
        setWarningMessage('User name already exists');
      };
    });
  };

  if (props.user) {
    return <Redirect to='/' />;
  };
  
  return (
    <form className='sign-up-form' onSubmit={makeAccount}>
      <p className='warning'>{warningMessage}</p>
      <label>Display Name</label>
      <input onChange={checkCharacters} name='displayName' type='text' required />
      <label>Email</label>
      <input name='email' type='email' required />
      <label>Password</label>
      <input name='password' type='password' minLength='6' required/>
      <button className='submit-btn btn' type='submit'>Create Account</button>
    </form>
  );
};

export default SignUp;