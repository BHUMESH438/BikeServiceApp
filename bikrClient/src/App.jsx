import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { DashboardLayout, HomeLayout, Landing, Login, Register, Error, BookService, ServiceList, Status } from './Pages';
import customFetch from './utils/customFetch.js';
import { action as registerAction } from './Pages/Register.jsx';
import { action as loginAction } from './Pages/Login.jsx';
// import { loader as dashboardLoader } from './Pages/Dashboard.jsx';
import Profile from './Pages/Profile.jsx';
import Admin from './Pages/Admin.jsx';
import EditService from './Pages/EditService.jsx';
const routers = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction
      },
      { path: 'login', element: <Login />, action: loginAction },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        // loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <BookService />
          },
          {
            path: 'servicelist',
            element: <ServiceList />
          },
          {
            path: 'status',
            element: <Status />
          },
          {
            path: 'profile',
            element: <Profile />
          },
          {
            path: 'admin',
            element: <Admin />
          },
          {
            path: 'edit-job/:id',
            element: <EditService />
          },
          { path: 'delete-job/:id' }
        ]
      }
    ]
  }
]);

const { data } = await customFetch('/test');
console.log(data.msg);
const App = () => {
  return <RouterProvider router={routers}></RouterProvider>;
};
export default App;
