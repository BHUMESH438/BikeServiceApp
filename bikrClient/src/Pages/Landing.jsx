import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <>
      <h1 className='text-center text-3xl font-bold'>Landing</h1>
      <Link to='/register' className='btn register-link'>
        Register
      </Link>
      <Link to='/login' className='btn '>
        Login / Demo User
      </Link>
    </>
  );
};
export default Landing;
