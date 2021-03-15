import '../styles/Feed.css';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Post from './Post';
import postFactory from '../scripts/postFactory';

const Feed = (props) => {
  const db = firebase.firestore();

  const [posts, setPosts] = useState({});
  const [groups] = useState({content: props.allGroups});
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
    }).then(() => {
      props.setAllPosts(prevState => ({
        ...prevState,
        [id]: newPost
      }));
    });
  };
 
  // This works. Is kind of ugly, but working for now.
  useEffect(() => {
    
    let tempPosts = {};
    if (props.group) {
      if (props.group === 'all') {
        Object.keys(props.allPosts).forEach((key) => {
          tempPosts[key] = props.allPosts[key];
        });
      } else {
        Object.keys(props.allPosts).forEach(key => {
          if (props.allPosts[key].group === props.group) {
            tempPosts[key] = props.allPosts[key];
          };
        });
      };
    } else {
      if (!props.userRef) {
        Object.keys(props.allPosts).forEach(key => {
          tempPosts[key] = props.allPosts[key];
        });
      } else {
        Object.keys(props.allPosts).forEach(key => {
          if (props.userRef.groups.includes(props.allPosts[key].group)) {
            tempPosts[key] = props.allPosts[key];
          };
        });
      };
    };
    setPosts(tempPosts);

  }, [props.allPosts, props.group, props.userRef]);  

  return (
    <div className='container'>
      <div className='feed'>
        {
          Object.keys(posts).map((key) => {
            return <Post key={key} post={posts[key]} id={key} userRef={props.userRef} allPosts={props.allPosts} allComments={props.allComments} setAllComments={props.setAllComments} />
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
              ((!props.group || props.group === 'all') &&
              (
                groups.content.map((group) => {
                  return <option key={group} value={group}>{group}</option>
                })
              )) ||
              <option value={props.group}>{props.group}</option>
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
- When not logged in, feed doesn't show all posts on reload

- Check why so many renders ( i think its because of how man posts/comments are rendered)

- What if user isn't subscribed to any groups

Button on right margin of Feed to make new pic post doesn't work
*/