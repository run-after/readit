import '../styles/PageNotFound.css';
import error from '../media/404.png';

const PageNotFound = () => {
  return (
    <img className='error-image' src={error} alt='404 error' />
  )
};

export default PageNotFound;