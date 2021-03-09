import '../styles/Groups.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Groups = (props) => {

  const [groups, setGroups] = useState({});
  const [userGroups, setUserGroups] = useState({ groups: [] });
  const [userRef, setUserRef] = useState({});  

  const joinGroup = (e) => {
    if (props.user) {
      const groupName = e.target.parentNode.dataset.name;
      const tempUserGroups = userGroups.groups;
      tempUserGroups.push(groupName);
      setUserGroups({ groups: tempUserGroups });
      firebase.firestore().collection('users').doc(props.user.displayName).set({
        email: userRef.email,
        displayName: userRef.displayName,
        groups: tempUserGroups
      });  
    } else {
      alert('sign in first');// TEMP
    };
  };

  const leaveGroup = (e) => {
    if(props.user){
      const groupName = e.target.parentNode.dataset.name;
      let tempUserGroups = userGroups.groups;
      tempUserGroups = tempUserGroups.filter((group) => { return group !== groupName })
      setUserGroups({ groups: tempUserGroups });
      firebase.firestore().collection('users').doc(props.user.displayName).set({
        email: userRef.email,
        displayName: userRef.displayName,
        groups: tempUserGroups
      });
    } else {
      alert('sign in first');// TEMP
    }
  };

  useEffect(() => {
    // Get all groups from DB
    firebase.firestore().collection('groups').get().then((querySnapSnot) => {
      let tempGroups = {};
      querySnapSnot.forEach((group) => {
        tempGroups[group.id] = group.data();
      });
      setGroups(tempGroups);
    });
    // Get all groups user is subscribed to
    if (props.user) {
      firebase.firestore().collection('users').doc(props.user.displayName).get().then((doc) => {
        setUserRef(doc.data());
        setUserGroups({ groups: doc.data().groups });
      });  
    };
  }, [props.user]);

  return (
    <div className='groups-container'>
      <div className='page-title'>
        GROUPS
      </div>
      <div className='list-container'>
        <ul className='groups-list'>
          {
            Object.keys(groups).map((key) => {
              return (
                <li key={key} data-name={key} className='group-item' >
                  <div className='group-header'>
                    {
                      (userGroups.groups.includes(key) &&
                        <button className='leave-group-btn'onClick={leaveGroup}>Leave</button>) ||
                        <button className='join-group-btn' onClick={joinGroup}>Join</button>
                    }
                    <Link to={`/groups/${key}`}>{key}</Link>
                  </div>
                  <div className='group-description'>
                    {groups[key].description}
                  </div>
                </li>
              
              );
            })
          }
        </ul>
        <div className='right-column'>
          {
            props.user &&
            <button className='create-group-btn'>Create your own group</button>                 
          }
        </div>
      </div>
    </div>
  )
};

export default Groups;


// style page
// make a way to create a new group
