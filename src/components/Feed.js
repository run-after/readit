import '../styles/Feed.css';
import upArrow from '../media/up-arrow.png';
import downArrow from '../media/down-arrow.png';
import { useState } from 'react';

const Feed = () => {

  const [voteCount, setVoteCount] = useState(0);

  const test = 'test name';
  const time = '8 days';
  const commentCount = 0;

  return (
    <div className='feed'>

      <div className='post'>
        <div className='left-margin'>
          <button className='upVoteBtn vote-btn'>
            <img className='up-arrow-img' src={upArrow} alt='up-arrow' />
          </button>
          {voteCount}
          <button className='down-vote-button vote-btn'>
            <img className='down-arrow-img' src={downArrow} alt='down-arrow' />
          </button>
        </div>
        <div className='post-content'>
          <div className='post-header'>
            {`Posted by: ${test} - ${time} ago`}
          </div>
          <div className='post-body'>
            Here is the post contents. If you post text, it will display here. If you post an image, it will display here.
          </div>
          <div className='post-footer'>
            <a href='#'>{commentCount} comments</a>
          </div>
        </div>  
      </div>

    </div>
  );
};

export default Feed;