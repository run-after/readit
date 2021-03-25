import Feed from './Feed';
import { useParams, Redirect } from 'react-router-dom';
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
      firebase.firestore().collection('users').doc(props.userRef.displayName)
        .set(tempUser);
      props.setUserRef(tempUser);
    };
  };

  const leaveGroup = () => {
    if(props.userRef){
      const groupName = group;
      let tempUserGroups = userGroups;
      tempUserGroups = tempUserGroups.filter(group => group !== groupName);
      setUserGroups(tempUserGroups);
      let tempUser = {
        email: props.userRef.email,
        displayName: props.userRef.displayName,
        groups: tempUserGroups,
        likes: props.userRef.likes,
        hates: props.userRef.hates
      };
      firebase.firestore().collection('users').doc(props.userRef.displayName)
        .set(tempUser);
      props.setUserRef(tempUser);
    };
  };

  useEffect(() => {
    if (props.userRef) {
      setUserGroups(props.userRef.groups)
    }; 
  }, [props.userRef]);

  if (!Object.keys(props.allGroups).includes(group) && group !== 'all') {
    return <Redirect to='/404' />
  };
  
  return (
    <div className='group'>
      <h1 className='page-title'>{group}</h1>
      {
        group !== 'all' &&
        ((userGroups.includes(group) &&
          <button className='leave-group-btn' onClick={leaveGroup}>Leave</button>) ||
          <button className='join-group-btn' onClick={joinGroup}>Join</button>)
      }
      <Feed
        group={group}
        userRef={props.userRef}
        setUserRef={props.setUserRef}
        allGroups={props.allGroups}
        allPosts={props.allPosts}
        setAllPosts={props.setAllPosts}
        allComments={props.allComments}
        setAllComments={props.setAllComments}
      />
    </div>
  );
};

export default Group;