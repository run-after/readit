import '../styles/Groups.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Groups = (props) => {

  const [groups, setGroups] = useState({});
  const [userGroups, setUserGroups] = useState({ groups: [] });
  const [userRef, setUserRef] = useState({});
  const [shouldDisplayForm, setShouldDisplayForm] = useState(false);
  
  const joinGroup = (e) => {
    if (props.user) {
      const groupName = e.target.parentNode.parentNode.dataset.name;
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
      const groupName = e.target.parentNode.parentNode.dataset.name;
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

  const displayForm = () => {
    setShouldDisplayForm(true);
  };

  const createGroup = (e) => {
    e.preventDefault();
    const groupName = e.target[0].value.toLowerCase();
    const groupDescription = e.target[1].value.toLowerCase();
    if (!Object.keys(groups).includes(groupName)) {
      firebase.firestore().collection('groups').doc(groupName).set({
        description: groupDescription
      }).then(() => {
        setShouldDisplayForm(false);
        setGroups(prevState => ({
          ...prevState,
          [groupName]: {
            description: groupDescription
          }
        }));
      });
    } else {// TEMP - not supposed to manipulate DOM
      document.querySelector('.warning').textContent = 'Group already exists';
    };
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
            <button className='create-group-btn' onClick={displayForm}>Create your own group</button>                 
          }
        </div>
      </div>
      {
        shouldDisplayForm &&
        <form className='create-group-form' onSubmit={createGroup}> 
          <h1>Create your group</h1>
          <div>
            <div className='warning'></div>
            <label>Group name</label>
            <input required maxLength='20' placeholder='Group name...' />
          </div>
          <div>
            <label>Group description</label>
            <textarea required minLength='5' maxLength='50' placeholder='Enter description' />
          </div>        
          <button>submit</button>
        </form>
        }
    </div>
  )
};

export default Groups;
