import upArrow from '../media/up-arrow.png';
import downArrow from '../media/down-arrow.png';
import '../styles/Post.css';
import formatTime from '../scripts/formatTime';

const Post = (props) => {

  const test = (e) => {
    const post = e.target.parentNode.parentNode.parentNode;
    console.log(post)
  }

  const timeNow = new Date().getTime();

  return (
    <div data-id={props.id} className='post'>
      <div className='left-margin'>
        <button onClick={test} className='upVoteBtn vote-btn'>
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
          commentCount comments
        </div>
      </div>  
    </div>
  );

};

export default Post;

/*
- Might want to add links to group on post and user on post
- Need to make upvote/downvote button work
- Need to make comment Count work
- Comments should probably drop down and show all comments associated with post

*/