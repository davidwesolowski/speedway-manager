import React, { FunctionComponent, useState } from 'react';
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

interface IUserState {
	email: string;
	username: string;
	password: string;
	repPassword: string;
}

const Register: FunctionComponent<RouteComponentProps> = props => {
	const [userData, setUserData] = useState<IUserState>({
		email: '',
		username: '',
		password: '',
		repPassword: ''
	});

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
							value={userData.email}
						/>
					</FormControl>
					<FormControl className="register-container__form-field">
						<TextField
							label="Nazwa użytkownika"
							required
							autoComplete="username"
							value={userData.username}
						/>
					</FormControl>
					<FormControl className="register-container__form-field">
						<TextField
							label="Hasło"
							required
							autoComplete="new-password"
							value={userData.password}
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
							autoComplete="new-password"
							value={userData.repPassword}
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
