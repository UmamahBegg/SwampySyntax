import { Button, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import './Login.Page.css';

const Login = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// We are consuming our user-management context to
	// get & set the user details here
	const { user, fetchUser, emailPasswordLogin } = useContext(UserContext);

	// We are using React's "useState" hook to keep track
	//  of the form values.
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	// This function will be called whenever the user edits the form.
	const onFormInputChange = event => {
		const { name, value } = event.target;
		setForm({ ...form, [name]: value });
	};

	// This function will redirect the user to the
	// appropriate page once the authentication is done.
	const redirectNow = () => {
		const redirectTo = location.search.replace('?redirectTo=', '');
		navigate(redirectTo ? redirectTo : '/homepage');
	};

	// Once a user logs in to our app, we don't want to ask them for their
	// credentials again every time the user refreshes or revisits our app,
	// so we are checking if the user is already logged in and
	// if so we are redirecting the user to the home page.
	// Otherwise we will do nothing and let the user to login.
	const loadUser = async () => {
		if (!user) {
			const fetchedUser = await fetchUser();
			if (fetchedUser) {
				// Redirecting them once fetched.
				redirectNow();
			}
		}
	};

	// This useEffect will run only once when the component is mounted.
	// Hence this is helping us in verifying whether the user is already logged in
	// or not.
	useEffect(() => {
		loadUser(); // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// This function gets fired when the user clicks on the "Login" button.
	const onSubmit = async event => {
		try {
			// Here we are passing user details to our emailPasswordLogin
			// function that we imported from our realm/authentication.js
			// to validate the user credentials and log in the user into our App.
			const user = await emailPasswordLogin(form.email, form.password);
			if (user) {
				redirectNow();
				navigate('/homepage');
			}
		} catch (error) {
			if (error.statusCode === 401) {
				alert('Invalid username/password. Try again!');
			} else {
				alert(error);
			}
		}
	};

	return (
		<div className='loginForm'>
			<form
				style={{
					display: 'flex',
					flexDirection: 'column',
					maxWidth: '300px',
					margin: 'auto',
				}}>
				<Link to='/' style={{ textDecoration: 'none', color: 'white' }}>
					{' '}
					<button className='closeFormButton'> X </button>
				</Link>
				<h1 className='login-h1'> Login</h1>
				<input
					className='loginInput'
					placeholder='Email'
					type='email'
					variant='outlined'
					name='email'
					value={form.email}
					onChange={onFormInputChange}
					onKeyPress={event => {
						if (event.key === 'Enter') {
							onSubmit();
						}
					}}
				/>
				<input
					className='loginInput'
					placeholder='Password'
					type='password'
					variant='outlined'
					name='password'
					value={form.password}
					onChange={onFormInputChange}
					onKeyPress={event => {
						if (event.key === 'Enter') {
							onSubmit();
						}
					}}
				/>

				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button
						className='loginButton'
						variant='contained'
						color='primary'
						onClick={onSubmit}
						sx={{
							backgroundColor: '#5aaaa6',
							border: '1px solid #47474782',
							borderRadius: '25px',
							display: 'flex',
							justifyContent: 'center',
							padding: '0.5em 3em 0.5em 3em',
							color: 'white',
							marginTop: '1vw',
							width: '4vw',
							textTransform: 'capitalize',
							textTransformFont: 'josefin sans',
							textTransformWeight: 'bold',
							textTransformSize: '15px',
							maxWidth: '60px',
							maxHeight: '30px',
							fontWeight: 'bold',
						}}>
						Login
					</Button>
				</div>

				<div className='loginLine'>
					<div className='orLine'>
						<p className='orText'>or</p>
					</div>
				</div>
				<Link
					className='sign-up-button'
					to='/signup'
					style={{ textDecoration: 'none', color: 'white' }}>
					{' '}
					<button>Sign Up </button>{' '}
				</Link>
			</form>
		</div>
	);
};

export default Login;
