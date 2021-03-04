import Feed from './Feed';
import { useParams } from 'react-router-dom';
import '../styles/Group.css';

const Group = (props) => {

  const { group } = useParams();
  
  return (
    <div className='group'>
      <h1 className='page-title'>{group}</h1>
      <Feed user={props.user} group={group} />
    </div>
  );
};

export default Group;

// Get list of groups, if the goup doesn't exist, should have a 404 type
// page.