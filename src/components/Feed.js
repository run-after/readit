import '../styles/Feed.css';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Post from './Post';
import postFactory from '../scripts/postFactory';

const Feed = (props) => {
  
  const db = firebase.firestore();

  const [posts, setPosts] = useState({});
  const [groups, setGroups] = useState({ content: [] });
  const [shouldDisplayForm, setShouldDisplayForm] = useState(false);

  const displayForm = () => {
    setShouldDisplayForm(true);
  };

  const doNotDisplayForm = () => {
    setShouldDisplayForm(false);
  };

  const createNewPost = (e) => {
    e.preventDefault();
    setShouldDisplayForm(false);
    const form = e.target;
    const newPost = postFactory(props.user.displayName, form[0].value, form[1].value, form[2].value)
    let id;
    db.collection('posts').add(newPost).then((doc) => {
      id = doc.id;
    }).then(() => {
      setPosts(prevState => ({
        ...prevState,
        [id]: newPost
      }));
    });
  };
 
  useEffect(() => {
    db.collection('posts').get().then((querySnapShot) => {
      let tempPosts = {};
      // Check if in a group page, and only display those
      if (props.group) {
        querySnapShot.docs.forEach((value) => {
          if (value.data().group === props.group) {
            tempPosts[value.id] = value.data();  
          };
        }); 
        // if not, display all posts
      } else {
        querySnapShot.docs.forEach((value) => {
          tempPosts[value.id] = value.data();
        });  
      };
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
  }, [db, props.group]);

  return (
    <div className='container'>
      <div className='feed'>
        {
          Object.keys(posts).map((key) => {
            return <Post key={key} post={posts[key]} id={key} user={props.user} userRef={props.userRef}/>
          })
        }
      </div>
      <div className='right-column'>
        {
          props.user &&
          <button onClick={displayForm}className='add-post-btn'>Submit new text post</button>                 
        }
        {
          props.user &&
          <button className='add-post-btn'>Submit new image post</button>
        }
      </div>
      {
        shouldDisplayForm &&
        <form className='post-form' onSubmit={createNewPost}>
          <input placeholder='Enter your title' />
          <textarea className='content' placeholder='Enter your content' />
          <select required name='groups'>
            <option value=''>--Choose a group</option>
            {
              (props.group && <option value={props.group}>{props.group}</option>) ||
              (
                groups.content.map((group) => {
                  return <option key={group} value={group}>{group}</option>
                })
              )
            }
          </select>
          <button>Submit</button>
          <button className='close-form' onClick={doNotDisplayForm}>x</button>
        </form>
      }
    </div>
  );
};

export default Feed;

/*
- Show all posts unless user is logged in - then only show groups subscribed to
- Check why so many renders ( i think its because of how man posts/comments are rendered)
*/