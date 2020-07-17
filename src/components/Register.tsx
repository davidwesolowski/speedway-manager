import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import {
	Paper,
	Typography,
	Divider,
	FormControl,
	TextField,
	Button,
	InputAdornment,
	IconButton
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { ValidationErrorItem } from '@hapi/joi';
import axios from 'axios';
import validateRegisterData from '../validation/validateRegisterData';

interface IUserState {
	email: string;
	username: string;
	password: string;
	repPassword: string;
}

interface IValidatedData {
	email: {
		message: string;
		error: boolean;
	};
	username: {
		message: string;
		error: boolean;
	};
	password: {
		message: string;
		error: boolean;
	};
	repPassword: {
		message: string;
		error: boolean;
	};
}

const Register: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {
	const defaultValidatedData = {
		email: {
			message: '',
			error: false
		},
		username: {
			message: '',
			error: false
		},
		password: {
			message: '',
			error: false
		},
		repPassword: {
			message: '',
			error: false
		}
	};

	const [userData, setUserData] = useState<IUserState>({
		email: '',
		username: '',
		password: '',
		repPassword: ''
	});
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showRepPassword, setShowRepPassword] = useState<boolean>(false);
	const [validatedData, setValidatedData] = useState<IValidatedData>(
		defaultValidatedData
	);
	const [registerSuccess, setRegisterSucess] = useState<boolean>(false);
	const [registerError, setRegisterError] = useState<boolean>(false);

	const handleOnChange = (name: string) => (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		if (event.target) {
			setUserData((prevState: IUserState) => ({
				...prevState,
				[name]: event.target.value
			}));
		}
	};

	const handleClickShowPassword = () =>
		setShowPassword((prevShowPassword: boolean) => !prevShowPassword);

	const handleClickShowRepPassword = () =>
		setShowRepPassword(
			(prevShowRepPassword: boolean) => !prevShowRepPassword
		);

	const registerUser = async (userData: IUserState) => {
		try {
			const {
				data: { error }
			} = await axios.post('/register', userData);
			if (error) {
				setRegisterSucess(false);
				setRegisterSucess(true);
			} else {
				setRegisterError(false);
				setRegisterSucess(true);
				setTimeout(() => {
					setRegisterSucess(false);
					push('/druzyna');
				}, 1000);
			}
		} catch (e) {
			setRegisterError(true);
			throw new Error('Error in registering user!');
		}
	};

	const handleOnSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const validationResponse = validateRegisterData(userData);
		if (validationResponse.error) {
			setValidatedData(() => defaultValidatedData);
			const { password, repPassword } = userData;
			validationResponse.error.details.forEach(
				(errorItem: ValidationErrorItem): any => {
					setValidatedData((prevState: IValidatedData) => ({
						...prevState,
						[errorItem.path[0]]: {
							message: errorItem.message,
							error: true
						}
					}));
				}
			);
			if (password != repPassword)
				setValidatedData((prevState: IValidatedData) => ({
					...prevState,
					repPassword: {
						message: 'Hasła muszą być takie same!',
						error: true
					}
				}));
		} else {
			registerUser(userData);
		}
	};

	return (
		<div className="register-container">
			<div className="register-container__img"></div>
			<Paper className="register-container__box">
				<Typography
					variant="h2"
					className="heading-1 register-container__heading"
				>
					Rejestracja
				</Typography>
				<Divider />
				<form
					className="register-container__form"
					onSubmit={handleOnSubmit}
				>
					<FormControl className="register-container__form-field">
						<TextField
							label="Adres e-mail"
							required
							autoComplete="email"
							value={userData.email}
							onChange={handleOnChange('email')}
							error={validatedData.email.error}
							helperText={
								validatedData.email.error
									? validatedData.email.message
									: ''
							}
						/>
					</FormControl>
					<FormControl className="register-container__form-field">
						<TextField
							label="Nazwa użytkownika"
							required
							autoComplete="username"
							value={userData.username}
							onChange={handleOnChange('username')}
							error={validatedData.username.error}
							helperText={
								validatedData.username.error
									? validatedData.username.message
									: ''
							}
						/>
					</FormControl>
					<FormControl className="register-container__form-field">
						<TextField
							label="Hasło"
							required
							autoComplete="new-password"
							type={showPassword ? 'text' : 'password'}
							value={userData.password}
							onChange={handleOnChange('password')}
							error={validatedData.password.error}
							helperText={
								validatedData.password.error
									? validatedData.password.message
									: ''
							}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={handleClickShowPassword}
										>
											{showPassword ? (
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
					<FormControl className="register-container__form-field">
						<TextField
							label="Powtórz hasło"
							required
							autoComplete="new-password"
							type={showRepPassword ? 'text' : 'password'}
							value={userData.repPassword}
							onChange={handleOnChange('repPassword')}
							error={validatedData.repPassword.error}
							helperText={
								validatedData.repPassword.error
									? validatedData.repPassword.message
									: ''
							}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={handleClickShowRepPassword}
										>
											{showRepPassword ? (
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
						Zarejestruj
					</Button>
					<Link
						to="/login"
						className="register-container__login-link"
					>
						Masz już konto? Zaloguj się!
					</Link>
					{registerSuccess && (
						<Alert variant="outlined" severity="success">
							Rejstracja zakończona powodzeniem!
						</Alert>
					)}
					{registerError && (
						<Alert variant="outlined" severity="error">
							Rejestracja zakończona niepowodzeniem!
						</Alert>
					)}
				</form>
			</Paper>
		</div>
	);
};

export default Register;
