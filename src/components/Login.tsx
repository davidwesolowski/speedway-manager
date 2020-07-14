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
					<form className="login-container__form">
						<FormControl className="login-container__form-field">
							<TextField
								label="Adres e-mail"
								value={userData.email}
								onChange={handleOnChange('email')}
							/>
						</FormControl>
						<FormControl className="login-container__form-field">
							<TextField
								label="Hasło"
								value={userData.password}
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
						<Button className="btn">Zaloguj</Button>
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
