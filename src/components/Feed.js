import '../styles/Feed.css';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Post from './Post';
import postFactory from '../scripts/postFactory';

const Feed = (props) => {
  
  const db = firebase.firestore();

  const [posts, setPosts] = useState({});
  const [groups, setGroups] = useState({content: []});
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
    const newPost = postFactory(props.userRef.displayName, form[0].value, form[1].value, form[2].value);
    let id;
    db.collection('posts').add(newPost).then((doc) => {
      id = doc.id;
      // The below .then needs to be changed. If i make a new post and am not subscribed to the group, it should not show up
    }).then(() => {
      props.setAllPosts(prevState => ({
        ...prevState,
        [id]: newPost
      }));
    });
  };
 
  // This works. Is kind of ugly, but working for now.
  useEffect(() => {
    if (props.posts) {
      let tempPosts = {};
      if (props.group) {
        if (props.group === 'all') {
          Object.keys(props.posts).forEach((key) => {
            tempPosts[key] = props.posts[key];
          });
        } else {
          Object.keys(props.posts).forEach(key => {
            if (props.posts[key].group === props.group) {
              tempPosts[key] = props.posts[key];
            };
          });
        };
      } else {
        if (!props.userRef) {
          Object.keys(props.posts).forEach(key => {
            tempPosts[key] = props.posts[key];
          });
        } else {
          Object.keys(props.posts).forEach(key => {
            if (props.userRef.groups.includes(props.posts[key].group)) {
              tempPosts[key] = props.posts[key];
            };
          });
        };
      };
      setPosts(tempPosts);
    };

    if (props.groups) {
      setGroups({content: props.groups});
    };
  }, [props.posts, props.group, props.userRef, props.groups]);  

  return (
    <div className='container'>
      <div className='feed'>
        {
          Object.keys(posts).map((key) => {
            return <Post key={key} post={posts[key]} id={key} user={props.userRef} userRef={props.userRef}/>
          })
        }
      </div>
      <div className='right-column'>
        {
          props.userRef &&
          <button onClick={displayForm}className='add-post-btn'>Submit new text post</button>                 
        }
        {
          props.userRef &&
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
- line 33 (create new post method)

- options for creating a new post when in group all, only lets you select group all

- Check why so many renders ( i think its because of how man posts/comments are rendered)

- What if user isn't subscribed to any groups

Button on right margin of Feed to make new pic post doesn't work
*/