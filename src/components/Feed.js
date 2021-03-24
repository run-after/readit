import '../styles/Feed.css';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import Post from './Post';
import postFactory from '../scripts/postFactory';
import { Link } from 'react-router-dom';

const Feed = (props) => {

  const [posts, setPosts] = useState({});
  const [groups, setGroups] = useState({});
  const [shouldDisplayForm, setShouldDisplayForm] = useState(false);
  const [shouldDisplayPicForm, setShouldDisplayPicForm] = useState(false);

  const displayForm = () => {
    setShouldDisplayForm(true);
  };

  const displayPicForm = () => {
    setShouldDisplayPicForm(true);
  };

  const doNotDisplayForm = () => {
    setShouldDisplayForm(false);
  };

  const doNotDisplayPicForm = () => {
    setShouldDisplayPicForm(false);
  };

  const createNewPost = (e) => {
    e.preventDefault();
    setShouldDisplayForm(false);
    const form = e.target;
    const newPost = postFactory(props.userRef.displayName, form[0].value, form[1].value, form[2].value, null);
    let id;
    firebase.firestore().collection('posts').add(newPost).then((doc) => {
      id = doc.id;
    }).then(() => {
      props.setAllPosts(prevState => ({
        ...prevState,
        [id]: newPost
      }));
    });
  };
  
  const checkDataSize = (e) => {
    if (e.target.files[0].size > 2000000) {
      document.querySelector('.file-uploader').style = 'border: 1px solid red; color: red;';
      document.querySelector('.pic-submit-btn').disabled = true;
    } else {
      document.querySelector('.file-uploader').style = 'border: none; color: black;';
      document.querySelector('.pic-submit-btn').disabled = false;
    };
  };

  const createPicNewPost = (e) => {
    // need to make it so only people logged in can upload
    // need to make it so everyone can view
    e.preventDefault();
    setShouldDisplayPicForm(false);
    const form = e.target;
    // Create ref
    const img = firebase.storage().ref().child(form[1].files[0].name);
    // store it
    img.put(form[1].files[0]).then(() => {
      img.getDownloadURL().then((url) => {
        const newPost = postFactory(props.userRef.displayName, form[0].value, null, form[2].value, url);
        let id;
        firebase.firestore().collection('posts').add(newPost).then((doc) => {
            id = doc.id;
          }).then(() => {
            props.setAllPosts(prevState => ({
              ...prevState,
              [id]: newPost
          }));
        });
      });  
    });
  };
 
  // This works. Is kind of ugly, but working for now.
  useEffect(() => {
    let tempPosts = {};
    if (props.group) {
      if (props.group === 'all') {
        tempPosts = JSON.parse(JSON.stringify(props.allPosts));
      } else {
        Object.keys(props.allPosts).forEach(key => {
          if (props.allPosts[key].group === props.group) {
            tempPosts[key] = props.allPosts[key];
          };
        });
      };
    } else {
      if (!props.userRef) {
        tempPosts = JSON.parse(JSON.stringify(props.allPosts));
      } else {
        Object.keys(props.allPosts).forEach(key => {
          if (props.userRef.groups.includes(props.allPosts[key].group)) {
            tempPosts[key] = props.allPosts[key];
          };
        });        
      };
    };
    if (Object.keys(tempPosts).length < 1 && !props.group) {
        const joinPost = postFactory('Readit', 'Join more groups to add to your feed', <Link to='/groups'>Join Groups</Link>, 'Feed');
        tempPosts['join'] = joinPost;
      } else if (Object.keys(tempPosts).length < 1 && props.group) {
        const firstPost = postFactory('Readit', 'Be the first to post here', ' ', props.group);
        tempPosts['first'] = firstPost;
      };
    setPosts(tempPosts);
  }, [props.allPosts, props.group, props.userRef]);

  useEffect(() => {
    setGroups(props.allGroups);
  }, [props.allGroups]);

  return (
    <div className='container'>
      <div className='feed'>
        {
          Object.keys(posts).map((key) => {
            return <Post
              key={key}
              post={posts[key]}
              id={key}
              userRef={props.userRef}
              setUserRef={props.setUserRef}
              allPosts={props.allPosts}
              setAllPosts={props.setAllPosts}
              allComments={props.allComments}
              setAllComments={props.setAllComments}
            />
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
          <button onClick={displayPicForm} className='add-post-btn'>Submit new image post</button>
        }
      </div>
      {
        shouldDisplayForm &&
        <form className='post-form' onSubmit={createNewPost}>
          <input required placeholder='Enter your title' />
          <textarea required className='content' placeholder='Enter your content' />
          <select required name='groups'>
            <option value=''>--Choose a group</option>
            {
              ((!props.group || props.group === 'all') &&
              (
                Object.keys(groups).map((group) => {
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
      {
        shouldDisplayPicForm &&
        <form className='post-form' onSubmit={createPicNewPost}>
          <input required placeholder='Enter your title' />
          <div className='file-uploader'>
            <input onChange={checkDataSize} type='file' accept='.png, .jpeg, .jpg, .gif' />
            Max size: 2MB
          </div>
          <select required name='groups'>
            <option value=''>--Choose a group</option>
            {
              ((!props.group || props.group === 'all') &&
              (
                Object.keys(groups).map((group) => {
                  return <option key={group} value={group}>{group}</option>
                })
              )) ||
              <option value={props.group}>{props.group}</option>
            }
          </select>
          <button className='pic-submit-btn'>Submit</button>
          <button className='close-form' onClick={doNotDisplayPicForm}>x</button>
        </form>
      }
    </div>
  );
};

export default Feed;