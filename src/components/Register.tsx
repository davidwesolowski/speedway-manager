import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
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
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Register: FunctionComponent<RouteComponentProps> = props => {
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
				<form className="register-container__form">
					<FormControl className="register-container__form-field">
						<TextField
							label="Adres e-mail"
							required
							autoComplete="email"
						/>
					</FormControl>
					<FormControl className="register-container__form-field">
						<TextField
							label="Nazwa użytkownika"
							required
							autoComplete="username"
						/>
					</FormControl>
					<FormControl className="register-container__form-field">
						<TextField
							label="Hasło"
							required
							autoComplete="current-password"
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
					<FormControl className="register-container__form-field">
						<TextField
							label="Powtórz hasło"
							required
							autoComplete="current-password"
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
					<Button className="btn" type="submit">
						Zarejestruj
					</Button>
				</form>
			</Paper>
		</div>
	);
};

export default Register;
