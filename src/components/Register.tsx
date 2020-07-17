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
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showRepPassword, setShowRepPassword] = useState<boolean>(false);

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
							onChange={handleOnChange('email')}
						/>
					</FormControl>
					<FormControl className="register-container__form-field">
						<TextField
							label="Nazwa użytkownika"
							required
							autoComplete="username"
							value={userData.username}
							onChange={handleOnChange('username')}
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
				</form>
			</Paper>
		</div>
	);
};

export default Register;
