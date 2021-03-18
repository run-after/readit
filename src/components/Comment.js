import upArrow from '../media/up-arrow.png';
import UpArrowLiked from '../media/up-arrow-liked.png';
import downArrow from '../media/down-arrow.png';
import downArrowHate from '../media/down-arrow-hate.png';
import formatTime from '../scripts/formatTime';
import '../styles/Comment.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const Comment = (props) => {
  
  const [likes, setLikes] = useState(props.comment.likes);
  const [liked, setLiked] = useState(false);
  const [hated, setHated] = useState(false);

  const timeNow = new Date().getTime();

  const UpVote = () => {
  
    if (props.userRef && !props.userRef.likes.includes(props.id)) {
      // find post in DB and up the score 1 point.
      let tempComment = JSON.parse(JSON.stringify(props.allComments[props.id]));
      tempComment.likes = likes + 1;
      firebase.firestore().collection('comments').doc(props.id)
        .set(tempComment);
      setLikes(likes + 1);

      // This updates allComments in App
      let tempAllComments = JSON.parse(JSON.stringify(props.allComments));
      tempAllComments[props.id] = tempComment;
      props.setAllComments(tempAllComments);

      // add like with ref to post
      const tempUser = JSON.parse(JSON.stringify(props.userRef));
      tempUser.likes.push(props.id);
      if (tempUser.hates.includes(props.id)) {
        tempUser.hates = tempUser.hates.filter((x) => x !== props.id);
      };
      props.setUserRef(tempUser);
      firebase.firestore().collection('users').doc(props.userRef.displayName)
        .set(tempUser);
      setLiked(true);
      setHated(false);
      // setCommentPoints is to update total points on user page
      if (props.setCommentPoints) {
        props.setCommentPoints(props.commentPoints + 1);
      };
    };
  };

  const downVote = () => {
    if (props.userRef && !props.userRef.hates.includes(props.id)) {
      let tempComment = JSON.parse(JSON.stringify(props.allComments[props.id]));
      tempComment.likes = likes - 1;
      firebase.firestore().collection('comments').doc(props.id)
        .set(tempComment);
      setLikes(likes - 1);

      // This updates allComments in App
      let tempAllComments = JSON.parse(JSON.stringify(props.allComments));
      tempAllComments[props.id] = tempComment;
      props.setAllComments(tempAllComments);

      // add hate with ref to post
      const tempUser = JSON.parse(JSON.stringify(props.userRef));
      tempUser.hates.push(props.id);
      if (tempUser.likes.includes(props.id)) {
        tempUser.likes = tempUser.likes.filter((x) => x !== props.id);
      };
      props.setUserRef(tempUser);
      firebase.firestore().collection('users').doc(props.userRef.displayName)
        .set(tempUser);
      setHated(true);
      setLiked(false);
      // setCommentPoints is to update total points on user page
      if (props.setCommentPoints) {
        props.setCommentPoints(props.commentPoints - 1);
      };
    };
  };

  useEffect(() => {
    if (props.userRef) {
      setLiked(props.userRef.likes.includes(props.id));
      setHated(props.userRef.hates.includes(props.id));
    };
  }, [props.userRef, props.id]);

  return (
    <div data-id={props.id} className='comment'>
      <div className='left-margin'>
        <button onClick={UpVote} className='upVoteBtn vote-btn'>
          {
            (liked &&
              <img className='up-arrow-img' src={UpArrowLiked} alt='orange-up-arrow' />) ||
            <img className='up-arrow-img' src={upArrow} alt='up-arrow' />
          }
        </button>
        {likes}
        <button onClick={downVote} className='down-vote-button vote-btn'>
          {
            (hated && 
              <img className='down-arrow-img' src={downArrowHate} alt='blue-down-arrow' />) ||
              <img className='down-arrow-img' src={downArrow} alt='down-arrow' />
          }
        </button>
      </div>
      <div className='comment-content'>
        <div className='comment-header'>
          {`Posted by: `}
          <Link to={`/user/${props.comment.user}`}>{props.comment.user}</Link>
          {` - ${formatTime(timeNow - props.comment.timestamp)}`}
        </div>
        <div className='comment-body'>
          {props.comment.content}
        </div>
      </div>  
    </div>
  );
};

export default Comment;