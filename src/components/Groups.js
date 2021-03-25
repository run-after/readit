import '../styles/Groups.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Groups = (props) => {

  const [userGroups, setUserGroups] = useState({ groups: [] });
  const [shouldDisplayForm, setShouldDisplayForm] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);
  
  const joinGroup = (e) => {
    if (props.userRef) {
      const groupName = e.target.parentNode.parentNode.dataset.name;
      const tempUserGroups = userGroups.groups;
      tempUserGroups.push(groupName);
      setUserGroups({ groups: tempUserGroups });
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

  const leaveGroup = (e) => {
    if(props.userRef){
      const groupName = e.target.parentNode.parentNode.dataset.name;
      let tempUserGroups = userGroups.groups;
      tempUserGroups = tempUserGroups.filter((group) => { return group !== groupName })
      setUserGroups({ groups: tempUserGroups });
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

  const displayForm = () => {
    setShouldDisplayForm(true);
  };

  const closeForm = () => {
    setShouldDisplayForm(false);
  };

  const checkName = (e) => {
    const submitBtn = document.querySelector('.form-submit');
    if (Object.keys(props.allGroups).includes(e.target.value.toLowerCase())) {
      setWarningMessage('Group already exists');
      submitBtn.disabled = true;
      return;
    };
    if (e.target.value.toLowerCase().includes(' ')) {
      setWarningMessage('No spaces allowed in name');
      submitBtn.disabled = true;
      return;
    };
    setWarningMessage(null);
    submitBtn.disabled = false;
  };

  const createGroup = (e) => {
    e.preventDefault();
    const groupName = e.target[0].value.toLowerCase();
    const groupDescription = e.target[1].value;
    
    firebase.firestore().collection('groups').doc(groupName).set({
        description: groupDescription
      }).then(() => {
        setShouldDisplayForm(false);
        props.setAllGroups(prevState => ({
          ...prevState,
          [groupName]: {
            description: groupDescription
          }
        }));
      });
  };

  useEffect(() => {
    if (props.userRef) {
      setUserGroups({ groups: props.userRef.groups });
    };
  }, [props.userRef]);

  return (
    <div className='groups-container'>
      <div className='page-title'>
        GROUPS
      </div>
      <div className='list-container'>
        <ul className='groups-list'>
          {
            Object.keys(props.allGroups).map((key) => {
              return (
                <li key={key} data-name={key} className='group-item' >
                  <div className='group-header'>
                    {
                      (userGroups.groups.includes(key) &&
                        <button className='leave-group-btn' onClick={leaveGroup}>Leave</button>) ||
                      <button className='join-group-btn' onClick={joinGroup}>Join</button>
                    }
                    <Link to={`/groups/${key}`}>{key}</Link>
                  </div>
                  <div className='group-description'>
                    {props.allGroups[key].description}
                  </div>
                </li>
              );
            })
          }
        </ul>
        <div className='right-column'>
          {
            props.userRef &&
            <button className='create-group-btn' onClick={displayForm}>Create your own group</button>
          }
        </div>
      </div>
      {
        shouldDisplayForm &&
        <form className='create-group-form' onSubmit={createGroup}>
          <div onClick={closeForm}className='close-form'>X</div>
          <h1>Create your group</h1>
          <div>
            <div className='warning'>{warningMessage}</div>
            <label>Group name</label>
            <input onChange={checkName} required maxLength='20' placeholder='Group name...' />
          </div>
          <div>
            <label>Group description</label>
            <textarea required minLength='5' maxLength='150' placeholder='Enter description' />
          </div>
          <button className='form-submit'>submit</button>
        </form>
      }
    </div>
  );
};

export default Groups;