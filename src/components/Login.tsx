import React, { FunctionComponent, useState, useContext } from 'react';
import {
	Paper,
	Typography,
	Divider,
	FormControl,
	InputAdornment,
	TextField,
	IconButton,
	Button
} from '@material-ui/core';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { ValidationErrorItem } from '@hapi/joi';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Link, RouteComponentProps } from 'react-router-dom';
import validateLoginData from '../validation/validateLoginData';
import { AppContext } from './AppProvider';
import { setUser } from '../actions/userActions';
import addNotification from '../notifications/addNotification';

interface IStateUser {
	email: string;
	password: string;
	showPassword: boolean;
}

interface IUser {
	email: string;
	password: string;
}
interface IValidateData {
	email: {
		message: string;
		error: boolean;
	};
	password: {
		message: string;
		error: boolean;
	};
}

const Login: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {
	const [userData, setUserData] = useState<IStateUser>({
		email: '',
		password: '',
		showPassword: false
	});

	const [validatedData, setValidatedData] = useState<IValidateData>({
		email: {
			message: '',
			error: false
		},
		password: {
			message: '',
			error: false
		}
	});

	const { dispatchUserData, setLoggedIn } = useContext(AppContext);

	const handleOnChange = (name: string) => (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		if (event.target) {
			setUserData((prevUserData: IStateUser) => ({
				...prevUserData,
				[name]: event.target.value
			}));
		}
	};

	const handleClickShowPassword = () => {
		setUserData((prevUserData: IStateUser) => ({
			...prevUserData,
			showPassword: !prevUserData.showPassword
		}));
	};

	const loginUser = async (user: IUser) => {
		try {
			const {
				data: { access_token }
			} = await axios.post(
				'https://fantasy-league-eti.herokuapp.com/auth/login',
				user
			);
			const cookies = new Cookies();
			cookies.set('access_token', access_token, { path: '/' });
			const options = {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			};
			const {
				data: { username, email, avatar_url }
			} = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/users/self',
				options
			);
			dispatchUserData(setUser({ username, email, avatar_url }));
			const title = 'Sukces!';
			const message = 'Zalogowano pomyślnie!';
			const type = 'success';
			const duration = 1000;
			addNotification(title, message, type, duration);
			setTimeout(() => {
				setLoggedIn(true);
				push('/druzyna');
			}, duration);
		} catch (e) {
			const title = 'Błąd!';
			const message = 'Wprowadzono błędne dane!';
			const type = 'danger';
			const duration = 1000;
			addNotification(title, message, type, duration);
		}
	};

	const handleOnSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const validationResponse = validateLoginData({
			email: userData.email,
			password: userData.password
		});
		if (validationResponse.error) {
			setValidatedData(() => ({
				email: {
					message: '',
					error: false
				},
				password: {
					message: '',
					error: false
				}
			}));
			validationResponse.error.details.forEach(
				(errorItem: ValidationErrorItem): any => {
					setValidatedData((prev: IValidateData) => ({
						...prev,
						[errorItem.path[0]]: {
							message: errorItem.message,
							error: true
						}
					}));
				}
			);
		} else {
			const { email, password } = userData;
			loginUser({ email, password });
		}
	};

	return (
		<div className="login-register-container">
			<div className="login-register-container__img"></div>
			<Paper className="login-register-container__box">
				<Typography
					variant="h2"
					className="heading-1 login-register-container__heading"
				>
					Zaloguj się
				</Typography>
				<Divider />
				<form
					className="login-register-container__form"
					onSubmit={handleOnSubmit}
				>
					<FormControl className="login-register-container__form-field">
						<TextField
							label="Adres e-mail"
							required
							error={validatedData.email.error}
							value={userData.email}
							helperText={
								validatedData.email.error
									? validatedData.email.message
									: ''
							}
							autoComplete="email"
							onChange={handleOnChange('email')}
						/>
					</FormControl>
					<FormControl className="login-register-container__form-field">
						<TextField
							label="Hasło"
							required
							value={userData.password}
							error={validatedData.password.error}
							helperText={
								validatedData.password.error
									? validatedData.password.message
									: ''
							}
							autoComplete="current-password"
							type={userData.showPassword ? 'text' : 'password'}
							onChange={handleOnChange('password')}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={handleClickShowPassword}
										>
											{userData.showPassword ? (
												<MdVisibility />
											) : (
												<MdVisibilityOff />
											)}
										</IconButton>
									</InputAdornment>
								)
							}}
						/>
					</FormControl>
					<Button className="btn" type="submit">
						Zaloguj
					</Button>
					<Link
						to="/rejestracja"
						className="login-register-container__link"
					>
						Nie masz jeszcze konta? Zarejestruj się tutaj!
					</Link>
				</form>
			</Paper>
		</div>
	);
};

export default Login;
