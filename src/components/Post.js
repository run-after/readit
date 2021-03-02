import upArrow from '../media/up-arrow.png';
import downArrow from '../media/down-arrow.png';
import '../styles/Post.css';
import formatTime from '../scripts/formatTime';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useState, useEffect } from 'react';
import Comment from './Comment';
import commentFactory from '../scripts/commentFactory';

const Post = (props) => {

  const [comments, setComments] = useState({});

  const testUpVote = (e) => {
    const post = e.target.parentNode.parentNode.parentNode;
    console.log(post)
  }

  const displayComments = (e) => {
    const post = e.target.parentNode.parentNode;
    const comments = post.querySelector('.comments');
    if (comments.style.display === 'flex') {
        comments.style = 'display: none';
      } else {
        comments.style = 'display: flex';
      };
  };

  const createNewComment = (e) => {
    e.preventDefault();
    // save to DB

    const form = e.target;
    const newComment = commentFactory(props.user.displayName, form[0].value, props.id);
    let id;
    e.target.children[0].value = '';
    firebase.firestore().collection('comments').add(newComment).then((doc) => {
      id = doc.id;
    });

    setComments(prevState => ({
      ...prevState,
      [id]: newComment
    }));
  };

  const timeNow = new Date().getTime();

  useEffect(() => {
    // Gets all comments associated with post and add to comments state    
    firebase.firestore().collection('comments').get().then((querySnapShot) => {
      querySnapShot.forEach((comment) => {
        if (comment.data().post === props.id) {
          setComments(prevState => ({
            ...prevState,
            [comment.id]: comment.data()
          }))
        };
      });
    });
  }, [props.id])

  return (
    <div data-id={props.id} className='post'>
      <div className='left-margin'>
        <button onClick={testUpVote} className='upVoteBtn vote-btn'>
          <img className='up-arrow-img' src={upArrow} alt='up-arrow' />
        </button>
        {props.post.likes}
        <button className='down-vote-button vote-btn'>
          <img className='down-arrow-img' src={downArrow} alt='down-arrow' />
        </button>
      </div>
      <div className='post-content'>
        <div className='post-header'>
          {`Posted by: ${props.post.user} - ${formatTime(timeNow - props.post.timestamp)} - in ${props.post.group}`}
        </div>
        <div className='post-title'>
          {props.post.title}
        </div>
        <div className='post-body'>
          {props.post.content}
        </div>
        <div className='post-footer'>
          <button onClick={displayComments}>{Object.keys(comments).length} comments</button>
        </div>
        <div className='comments'>
          {
            props.user && 
            <form className='comment-form' onSubmit={createNewComment}>
              <textarea placeholder='Your thoughts...' />
              <button className='submit-comment'>Save</button>
            </form>
          }
          
          {
            Object.keys(comments).map((key) => {
              return <Comment key={key} comment={comments[key]} id={key} />
            })
          }
        </div>
      </div>  
    </div>
  );

};

export default Post;

/*
- Might want to add links to group on post and user on post
- Need to make upvote/downvote button work
- Make like button work 
  - Will need to keep track of whether user up/down voted it

*/