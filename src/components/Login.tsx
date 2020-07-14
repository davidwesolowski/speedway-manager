import React, { FunctionComponent } from 'react';
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

const Login: FunctionComponent = () => {
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
							<TextField label="Adres e-mail" />
						</FormControl>
						<FormControl className="login-container__form-field">
							<TextField
								label="Hasło"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton>
												<MdVisibility />
												<MdVisibilityOff />
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
