import React, { FunctionComponent, useState } from 'react';
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
import { Link } from 'react-router-dom';
import validateLoginData from '../validation/validateLoginData';
import { ValidationErrorItem } from '@hapi/joi';

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

const Login: FunctionComponent = () => {
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
		}
		console.log('tutaj', validatedData);
	};

	return (
		<div className="login-container">
			<div className="login-container__img"></div>
			<Paper className="login-container__box">
				<Typography
					variant="h2"
					className="heading-1 login-container__login_heading"
				>
					Zaloguj się
				</Typography>
				<Divider />
				<div className="login-contaier__form-box">
					<form
						className="login-container__form"
						onSubmit={handleOnSubmit}
					>
						<FormControl className="login-container__form-field">
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
								autoComplete="username"
								onChange={handleOnChange('email')}
							/>
						</FormControl>
						<FormControl className="login-container__form-field">
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
								type={
									userData.showPassword ? 'text' : 'password'
								}
								onChange={handleOnChange('password')}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={
													handleClickShowPassword
												}
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
							className="login-container__register-link"
						>
							Nie masz jeszcze konta? Zarejestruj się tutaj!
						</Link>
					</form>
				</div>
			</Paper>
		</div>
	);
};

export default Login;
