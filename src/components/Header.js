import '../styles/Header.css';
import logo from '../media/alien.png';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = (props) => {

  const [groups, setGroups] = useState({names: []});

  const logOut = () => {
    firebase.auth().signOut().then(() => {
      props.setUser(null);
      window.location.reload();
    });
  };
  useEffect(() => {
    firebase.firestore().collection('groups').get().then((querySnapShot) => {
      let tempGroups = [];
      if (props.user) {
        firebase.firestore().collection('users').doc(props.user.displayName).get().then((doc) => {
          tempGroups = doc.data().groups;
        }).then(() => {
          setGroups({ names: tempGroups });
        });
      } else {
        querySnapShot.forEach((x) => {
          tempGroups.push(x.id);
        });
        setGroups({names: tempGroups})
      };
    })
  }, [props.user]);
  
  return (
    <div className='header'>
      <div className='group-list'>
        <span className='my-groups'>MY GROUPS: </span>
        <div className='groups'>
          {groups.names.map((name) => {
          return <Link key={`header${name}`}to={`/groups/${name}`}>{name.toUpperCase()}</Link>
        })}
        </div>
        <Link className='more-groups' to={`/groups`}>MORE>></Link>
      </div>
      <div className='header-main'>
        <Link className='page-title' to='/'>
          <img className='logo' alt='logo' src={logo} />
          readit
        </Link>
        <div className='buttons'>
          {!props.user && <Link to='/login'><button className='login-btn btn'>Login</button></Link>}
          {props.user && <Link className='user-name' to={`/user/${props.user.displayName}`}>{props.user.displayName}</Link>}
          {props.user && <Link to='/'><button onClick={logOut}className='log-out-btn btn'>Log out</button></Link>}
          {!props.user && <Link to='/signup'><button className='sign-up-btn btn'>Sign up</button></Link>}
        </div>
      </div>
      
    </div>
  );
};

export default Header;

// LINE 44 - need to make a GROUPS PAGE TO LIST ALL GROUPS (or just a drop down)