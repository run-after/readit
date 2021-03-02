import upArrow from '../media/up-arrow.png';
import downArrow from '../media/down-arrow.png';
import formatTime from '../scripts/formatTime';
import '../styles/Comment.css'

const Comment = (props) => {

  const timeNow = new Date().getTime();


  return (
    <div data-id={props.id} className='comment'>
      <div className='left-margin'>
        <button className='upVoteBtn vote-btn'>
          <img className='up-arrow-img' src={upArrow} alt='up-arrow' />
        </button>
        {props.comment.likes}
        <button className='down-vote-button vote-btn'>
          <img className='down-arrow-img' src={downArrow} alt='down-arrow' />
        </button>
      </div>
      <div className='comment-content'>
        <div className='comment-header'>
          {`Posted by: ${props.comment.user} - ${formatTime(timeNow - props.comment.timestamp)}`}
        </div>
        <div className='comment-body'>
          {props.comment.content}
        </div>
      </div>  
    </div>
  );
};

export default Comment;

/*
  - Make like button work
  - Make form for add comment
*/