import '../styles/User.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Post from './Post';

const User = () => {

  const [doesUserExist, setDoesUserExist] = useState(false);
  const [userPosts, setUserPosts] = useState({ content: [] });

  const { name } = useParams();
  
  const thisUserRef = firebase.firestore().collection('users').doc(name);
  
  // checks if user exists in DB
  thisUserRef.get().then((doc) => {
    if (doc.data()) {
      setDoesUserExist(true);
    };
  });

  useEffect(() => {
    // This gets every doc in posts collection and logs them
    firebase.firestore().collection('posts').get().then((querySnapShot) => {
      let tempPosts = [];
      querySnapShot.docs.forEach((value) => {
        if (value.data().user === name) {
          tempPosts.push(value.data());  
        }
      });
      setUserPosts({ content: tempPosts });
    });
  }, [name])

  //thisUserRef.get().then((doc) => {
  //  console.log(doc.data())
  //});

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
        {
          userPosts.content.map((post) => {
            return <Post key={post.title} post={post} />
          })
        }
      </div>
      
    </div>
    
    
  );
};

export default User;