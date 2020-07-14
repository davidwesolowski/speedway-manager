import React, { FunctionComponent, useState } from 'react';
import {
	Paper,
	Typography,
	Divider,
	FormControl,
	InputAdornment,
	TextField,
	IconButton,
	Button,
	FormHelperText
} from '@material-ui/core';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Link } from 'react-router-dom';
import validateLoginData from '../validation/validateLoginData';

interface IStateUser {
	email: string;
	password: string;
	showPassword: boolean;
}

const Login: FunctionComponent = () => {
	const [userData, setUserData] = useState<IStateUser>({
		email: '',
		password: '',
		showPassword: false
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
		const { error } = validateLoginData({
			email: userData.email,
			password: userData.password
		});
		console.log(error);
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
								value={userData.email}
								autoComplete="username"
								onChange={handleOnChange('email')}
							/>
							<FormHelperText>Tekst</FormHelperText>
						</FormControl>
						<FormControl className="login-container__form-field">
							<TextField
								label="Hasło"
								required
								value={userData.password}
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
							<FormHelperText>Tekst</FormHelperText>
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
