import '../styles/User.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Post from './Post';
import Comment from './Comment';

const User = (props) => {

  const [doesUserExist, setDoesUserExist] = useState(false);
  const [userPosts, setUserPosts] = useState({});
  const [userComments, setUserComments] = useState({});
  const [postPoints, setPostPoints] = useState(0);
  const [commentPoints, setCommentPoints] = useState(0);

  const { name } = useParams();
  
  const thisUserRef = firebase.firestore().collection('users').doc(name);
  
  // checks if user exists in DB
  thisUserRef.get().then((doc) => {
    if (doc.data()) {
      setDoesUserExist(true);
    };
  });

  useEffect(() => {
    let tempPosts = {};
    Object.keys(props.allPosts).forEach(key => {
      if (props.allPosts[key].user === name) {
        tempPosts[key] = props.allPosts[key];
        setPostPoints(p => p + props.allPosts[key].likes);
      };
    });
    // Lists all comments made by user
    let tempComments = {};
    Object.keys(props.allComments).forEach(key => {
      if (props.allComments[key].user === name) {
        tempComments[key] = props.allComments[key];
        setCommentPoints(c => c + props.allComments[key].likes);
      };
    });
    setUserPosts(tempPosts);
    setUserComments(tempComments);
  }, [name, props.allPosts, props.allComments, props.userRef]);

  return (
    <div className='user-container'>
      {
        doesUserExist &&
        <div className='user'>
          <div className='image-placeholder'></div>
          <p className='user-name'>{name}</p>
          <p className='post-points'>Post points: {postPoints}</p>
          <p className='comment-points'>Comment points: {commentPoints}</p> 
        </div>
      }
      {
        !doesUserExist && <div className='user'>Does not exist</div>
      }
      <div className='feed'>
        <div>Posts:</div>
        {
          Object.keys(userPosts).map((key) => {
            return <Post key={key} post={userPosts[key]} id={key} user={props.user} allComments={props.allComments} userRef={props.userRef}/>
          })
        }
        Comments:
        {
          Object.keys(userComments).map((key) => {
            return <Comment key={key} comment={userComments[key]} id={key} userRef={props.userRef} />
          })
        }
      </div>
    </div>
  );
};

export default User;

// If I like a comment in comment section.. it doesn't show on comment in post (not a huge deal)