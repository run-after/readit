import '../styles/User.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import Post from './Post';
import Comment from './Comment';
import error from '../media/404.png';
import defaultAvatar from '../media/default-avatar.png';

const User = (props) => {

  const [doesUserExist, setDoesUserExist] = useState(true);
  const [userPosts, setUserPosts] = useState({});
  const [userComments, setUserComments] = useState({});
  const [userAvatar, setUserAvatar] = useState(defaultAvatar);
  const [postPoints, setPostPoints] = useState(0);
  const [commentPoints, setCommentPoints] = useState(0);
  const [warning, setWarning] = useState(null);

  const { name } = useParams();

  const uploadAvatar = (e) => {
    const file = e.target.files[0];
    if (file.size < 2000000) {
      setWarning(null);
      const img = firebase.storage().ref().child(`avatars/${name}`);
      // store it
      img.put(file).then(() => {
        img.getDownloadURL().then((url) => {
          const tempUser = JSON.parse(JSON.stringify(props.userRef));
          tempUser['avatar'] = url;
          firebase.firestore().collection('users').doc(name).set(tempUser);
          props.setUserRef(tempUser);
          setUserAvatar(url);
        });  
      });
    } else {
      setWarning('Max file size is 2MB');
    };
  };

  const displayUser = (
    <div className='user-page'>
      <div className='user'>
        <img className='avatar' src={userAvatar} alt={name} />
        <p className='warning'>{warning}</p>
        {
          props.userRef &&
          props.userRef.displayName === name &&
          <input onChange={uploadAvatar}type='file' />
        }
        <p className='user-name'>{name}</p>
        <p className='post-points'>Post points: {postPoints}</p>
        <p className='comment-points'>Comment points: {commentPoints}</p>
      </div>

      <div className='feed'>
        <div>Posts:</div>
        {
          Object.keys(userPosts).map((key) => {
            return <Post
              key={key}
              post={userPosts[key]}
              id={key}
              allPosts={props.allPosts}
              setAllPosts={props.setAllPosts}
              allComments={props.allComments}
              setAllComments={props.setAllComments}
              userRef={props.userRef}
              setUserRef={props.setUserRef}
              postPoints={postPoints}
              setPostPoints={setPostPoints}
            />
          })
        }
        Comments:
        {
          Object.keys(userComments).map((key) => {
            return <Comment
              key={key}
              comment={userComments[key]}
              id={key}
              userRef={props.userRef}
              setUserRef={props.setUserRef}
              allComments={props.allComments}
              setAllComments={props.setAllComments}
              commentPoints={commentPoints}
              setCommentPoints={setCommentPoints}
            />
          })
        }
      </div>
    </div>
  );
  // checks if user exists in DB
  firebase.firestore().collection('users').doc(name).get()
    .then((doc) => {
    setDoesUserExist(!!doc.data());
  });

  useEffect(() => {
    let tempPosts = {};
    let tempPostPoints = 0;
    Object.keys(props.allPosts).forEach(key => {
      if (props.allPosts[key].user === name) {
        tempPosts[key] = JSON.parse(JSON.stringify(props.allPosts[key]));
        tempPostPoints += props.allPosts[key].likes;
      };
    });
    // Lists all comments made by user
    let tempComments = {};
    let tempCommentPoints = 0;
    Object.keys(props.allComments).forEach(key => {
      if (props.allComments[key].user === name) {
        tempComments[key] = JSON.parse(JSON.stringify(props.allComments[key]));
        tempCommentPoints += props.allComments[key].likes;
      };
    });
    // Get user avatar
    firebase.firestore().collection('users').doc(name).get().then((doc) => {
      if (doc.data()) {
        setUserAvatar(doc.data().avatar);  
      };
    });
    
    setUserPosts(tempPosts);
    setUserComments(tempComments);
    setPostPoints(tempPostPoints);
    setCommentPoints(tempCommentPoints);
  }, [name, props.allPosts, props.allComments, props.userRef]);

  return (
    <div className='user-container'>
      {(doesUserExist && displayUser) || <img className='error-image' src={error} alt='user not found'/>}
    </div>
  );
};

export default User;