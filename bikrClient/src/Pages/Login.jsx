import { Form, Link, redirect } from 'react-router-dom';
import { FormInput, SubmitButton } from '../Components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/auth/login', data);
    toast.success('Login successful');
    return redirect('/dashboard');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Login = () => {
  return (
    <section className='h-screen grid place-items-center'>
      <Form method='post' className='card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4'>
        <h4 className='text-center text-3xl font-bold'>Login</h4>
        <FormInput type='email' label='email' name='email' defaultValue='james@gmail.com' />
        <FormInput type='password' label='password' name='password' defaultValue='qwe123asd' />
        <div className='mt-4'>
          <SubmitButton text='login' />
        </div>
        <button type='button' className='btn btn-secondary btn-block'>
          guest user
        </button>
        <p className='text-center'>
          Not a member yet?
          <Link to='/register' className='ml-2 link link-hover link-primary capitalize'>
            register
          </Link>
        </p>
      </Form>
    </section>
  );
};
export default Login;

// <section className='h-screen grid place-items-center'></section>; if we use gird palce-items center we dont want to worry about vertical and horizontal spacing
