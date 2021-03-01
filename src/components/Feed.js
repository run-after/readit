import '../styles/Feed.css';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Post from './Post';
import postFactory from '../scripts/postFactory';

const Feed = (props) => {

  const db = firebase.firestore();
  // App passes in user prop
  //console.log(props);
  const [posts, setPosts] = useState({});

  const [groups, setGroups] = useState({ content: [] });

  const showPostForm = () => {
    document.querySelector('.post-form').style = 'display: flex;'
  };

  const hidePostForm = () => {
    const form = document.querySelector('.post-form');
    form.style = 'display: none;';
    form[0].value = '';
    form[1].value = '';
    form[2].value = '';
  };

  // Might want to add reference to user object under posts?
  const createNewPost = (e) => {
    e.preventDefault();
    const form = e.target;
    const newPost = postFactory(props.user.displayName, form[0].value, form[1].value, form[2].value)
    let id;
    db.collection('posts').add(newPost).then((doc) => {
      id = doc.id;
    });

    hidePostForm();
    setPosts(prevState => ({
      ...prevState,
      [id]: newPost
    }));

  };
 
  useEffect(() => {
    // This gets every doc in posts collection and logs them
    db.collection('posts').get().then((querySnapShot) => {
      let tempPosts = {};
      querySnapShot.docs.forEach((value) => {
        tempPosts[value.id] = value.data();
      });
      setPosts(tempPosts);
    });

    // Get all groups from DB
    db.collection('groups').get().then((querySnapShot) => {
      let tempGroups = [];
      querySnapShot.forEach(x => {
        tempGroups.push(x.id);
      });
      setGroups({ content: tempGroups });
  })
  }, [db]);

  return (
    <div className='container'>
      <div className='feed'>
        {
          Object.keys(posts).map((key) => {
            return <Post key={key} post={posts[key]} id={key} />
          })
        }
      </div>
      <div className='right-column'>
        {
          props.user &&
          <button onClick={showPostForm}className='add-post-btn'>Submit new text post</button>                 
        }
        {
          props.user &&
          <button className='add-post-btn'>Submit new image post</button>
        }
      </div>
      {/* maybe a component? */}
      <form className='post-form' onSubmit={createNewPost}>
        <input placeholder='Enter your title' />
        <textarea className='content' placeholder='Enter your content' />
        <select required name='groups'>
          <option value=''>--Choose a group</option>
          {groups.content.map((group) => {
            return <option key={group} value={group}>{group}</option>
          })}
        </select>
        <button>submit</button>
      </form>
    
    </div>
  );
};

export default Feed;

/*
- Might want to add a reference to user object in DB of post after post is created
- Show all posts unless user is logged in - then only show groups subscribed to
- Make a dropdown so they can select what group to view (or maybe that will just  be a group page)
*/