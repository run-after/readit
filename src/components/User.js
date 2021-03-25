import '../styles/User.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Post from './Post';
import Comment from './Comment';
import error from '../media/404.png';

const User = (props) => {

  const [doesUserExist, setDoesUserExist] = useState(true);
  const [userPosts, setUserPosts] = useState({});
  const [userComments, setUserComments] = useState({});
  const [postPoints, setPostPoints] = useState(0);
  const [commentPoints, setCommentPoints] = useState(0);

  const { name } = useParams();

  const displayUser = (
    <div className='user-page'>
      <div className='user'>
        <div className='image-placeholder'></div>
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