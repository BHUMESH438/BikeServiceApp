import { Form, redirect, Link } from 'react-router-dom';
import { FormInput, SubmitButton } from '../Components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post('/auth/register', data);
    toast.success('Registration successful');
    return redirect('/login');
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.msg);
    return error;
  }
};
const Register = () => {
  return (
    <section className='grid h-screen place-items-center'>
      <Form method='post' className='card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4'>
        <h4 className='text-center text-3xl font-bold'>Register</h4>
        <FormInput type='text' label='username' name='name' defaultValue='james smith' />
        <FormInput type='email' label='email' name='email' defaultValue='james@gmail.com' />
        <FormInput type='password' label='password' name='password' defaultValue='secret' />
        <FormInput type='text' label='PhoneNumber' name='phone' defaultValue='6383665184' />
        <FormInput type='text' label='location' name='location' defaultValue='Karur' />
        <div className='mt-4'>
          <SubmitButton text='register' />
        </div>
        <p className='text-center'>
          Already a member?
          <Link to='/login' className='ml-2 link link-hover link-primary capitalize'>
            login
          </Link>
          <Link to='/' className='ml-2 link link-hover link-primary capitalize'>
            Home
          </Link>
        </p>
      </Form>
    </section>
  );
};
export default Register;
//
