import '../styles/User.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Post from './Post';
import Comment from './Comment';

const User = () => {

  const [doesUserExist, setDoesUserExist] = useState(false);
  const [userPosts, setUserPosts] = useState({});
  const [userComments, setUserComments] = useState({});

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
          <p className='post-points'>Post points: (This will come from DB)</p>
          <p className='comment-points'>Comment points: (This will also come from DB)</p> 
        </div>
      }
      {
        !doesUserExist && <div className='user'>Does not exist</div>
      }
      <div className='feed'>
        Posts:
        {
          Object.keys(userPosts).map((key) => {
            return <Post key={userPosts[key].title} post={userPosts[key]} />
          })
        }
        Comments:
        {
          Object.keys(userComments).map((key) => {
            return <Comment key={key} comment={userComments[key]} />
          })
        }
      </div>
    </div>
  );
};

export default User;