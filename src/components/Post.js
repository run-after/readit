import upArrow from '../media/up-arrow.png';
import upArrowLiked from '../media/up-arrow-liked.png';
import downArrow from '../media/down-arrow.png';
import '../styles/Post.css';
import formatTime from '../scripts/formatTime';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useState, useEffect } from 'react';
import Comment from './Comment';
import commentFactory from '../scripts/commentFactory';
import { Link } from 'react-router-dom';

const Post = (props) => {
  
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState(props.post.likes);
  const [liked, setLiked] = useState(false);

  const UpVote = () => {
    if (props.user && !props.userRef.likes.includes(props.id)) {
      // find post in DB and up the score 1 point.
      let tempPost;
      firebase.firestore().collection('posts').doc(props.id).get().then((doc) => {
        tempPost = doc.data();
        tempPost.likes = likes + 1;
      }).then(() => {
        firebase.firestore().collection('posts').doc(props.id).set(
          tempPost
        );
        setLikes(likes + 1);
      });
      // add like with ref to post
      const tempUser = props.userRef;
      tempUser.likes.push(props.id);
      firebase.firestore().collection('users').doc(props.user.displayName).set(
        tempUser
      );
      setLiked(true);
    };
  };

  // Can change this so you don't change style, just set state and rerender
  // if button clicked
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

    if (props.userRef) {
      setLiked(props.userRef.likes.includes(props.id))
    }
  }, [props.id]);

  return (
    <div data-id={props.id} className='post'>
      <div className='left-margin'>
        <button onClick={UpVote} className='upVoteBtn vote-btn'>
          {
            (liked &&
              <img className='up-arrow-img' src={upArrowLiked} alt='orange-up-arrow' />) ||
            <img className='up-arrow-img' src={upArrow} alt='up-arrow' />
          }
        </button>
        {likes}
        <button className='down-vote-button vote-btn'>
          <img className='down-arrow-img' src={downArrow} alt='down-arrow' />          
        </button>
      </div>
      <div className='post-content'>
        <div className='post-header'>
          {'Posted by: '}
          <Link to={`/user/${props.post.user}`}>{props.post.user}</Link> 
          {` - ${formatTime(timeNow - props.post.timestamp)} - in `}
          <Link to={`/groups/${props.post.group}`}>{props.post.group}</Link>
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