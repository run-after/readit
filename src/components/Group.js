import Feed from './Feed';
import { useParams } from 'react-router-dom';
import {useEffect, useState} from 'react';
import '../styles/Group.css';
import firebase from 'firebase/app';
import 'firebase/firestore';

const Group = (props) => {

  const { group } = useParams();

  const [userGroups, setUserGroups] = useState([]);

  const joinGroup = () => {
    if (props.userRef) {
      const groupName = group;
      const tempUserGroups = userGroups;
      tempUserGroups.push(groupName);
      setUserGroups(tempUserGroups );
      let tempUser = {
        email: props.userRef.email,
        displayName: props.userRef.displayName,
        groups: tempUserGroups,
        likes: props.userRef.likes,
        hates: props.userRef.hates
      };
      firebase.firestore().collection('users').doc(props.userRef.displayName).set(
        tempUser
      );
      props.setUserRef(tempUser);
    } else {
      alert('sign in first');// TEMP
    };
  };

  const leaveGroup = () => {
    if(props.userRef){
      const groupName = group;
      let tempUserGroups = userGroups;
      tempUserGroups = tempUserGroups.filter((group) => { return group !== groupName })
      setUserGroups(tempUserGroups);
      let tempUser = {
        email: props.userRef.email,
        displayName: props.userRef.displayName,
        groups: tempUserGroups,
        likes: props.userRef.likes,
        hates: props.userRef.hates
      };
      firebase.firestore().collection('users').doc(props.user.displayName).set(
        tempUser
      );
      props.setUserRef(tempUser);
    } else {
      alert('sign in first');// TEMP
    }
  };

  useEffect(() => {
    if (props.userRef) {
        setUserGroups(props.userRef.groups)  
      };  
      
  }, [props.userRef])
  
  return (
    <div className='group'>
      <h1 className='page-title'>{group}</h1>
      {
        group !== 'all' &&
        ((userGroups.includes(group) &&
          <button className='leave-group-btn' onClick={leaveGroup}>Leave</button>) ||
          <button className='join-group-btn' onClick={joinGroup}>Join</button>)
      }
      <Feed user={props.user} group={group} userRef={props.userRef}/>
    </div>
  );
};

export default Group;

// Get list of groups, if the goup doesn't exist, should have a 404 type
// page.