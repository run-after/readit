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
    // Lists posts made by user
    firebase.firestore().collection('posts').get().then((querySnapShot) => {
      let tempPosts = {};
      querySnapShot.docs.forEach((value) => {
        if (value.data().user === name) {
          tempPosts[value.id] = value.data();
          setPostPoints(p=> p + value.data().likes);
        };
      });
      setUserPosts(tempPosts);
    });

    // Lists all comments made by user
    firebase.firestore().collection('comments').get().then((querySnapShot) => {
      let tempComments = {};
      querySnapShot.docs.forEach((value) => {
        if (value.data().user === name) {
          tempComments[value.id] = value.data();
          setCommentPoints(c => c + value.data().likes);
        };
      });
      setUserComments(tempComments);
    });
  }, [name]);

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
        Posts:
        <div className='add-post'>
          <button className='text-post-btn'>Add text post</button>
          <button className='photo-post-btn'>Add photo post</button>
        </div>
        {
          Object.keys(userPosts).map((key) => {
            return <Post key={key} post={userPosts[key]} id={key} user={props.user} userRef={props.userRef}/>
          })
        }
        Comments:
        {
          Object.keys(userComments).map((key) => {
            return <Comment key={key} comment={userComments[key]} id={key} user={props.user} userRef={props.userRef} />
          })
        }
      </div>
    </div>
  );
};

export default User;

// If I like a comment in comment section.. it doesn't show on comment in post (not a huge deal)
// Make post buttons work