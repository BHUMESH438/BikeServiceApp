import { Outlet } from 'react-router-dom';
import { BigSideBar, NavBar, SmallSideBar } from '../Components';
import Wrapper from '../wrappers/Dashboard';
// import customFetch from '../utils/customFetch';

// export const loader = async () => {
//   try {
//     const { data } = await customFetch('users/current-user');
//     return data;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

const Dashboard = () => {
  // const data = useLoaderData();
  // console.log('data', data);
  return (
    <Wrapper>
      <main className='dashboard'>
        <SmallSideBar />
        <BigSideBar />
        <div>
          <NavBar />
          <div>
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};
export default Dashboard;
