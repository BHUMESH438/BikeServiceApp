import { useNavigation } from 'react-router-dom';

const SubmitButton = ({ text }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <button type='submit' className='btn btn-primary btn-block'>
      {isSubmitting ? (
        <>
          <span className='loading loading-spinner'>sending...</span>
        </>
      ) : (
        text || 'submit'
      )}
    </button>
  );
};
export default SubmitButton;

//just dont use any div or margin in this component. so it can be reusable in many projects
