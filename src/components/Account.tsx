/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import {
	Paper,
	Typography,
	Divider,
	TextField,
	IconButton,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	FormControl,
	Grid,
	InputAdornment
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { TiPen, TiTimes } from 'react-icons/ti';
import { FiX } from 'react-icons/fi';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

interface IState {
	username: string;
	club: string;
	points: number;
	position: number;
	password: string;
	newPassword: string;
}

const Account: FunctionComponent = () => {
	const accountDefaultData = {
		username: 'Testowy',
		club: 'GKM',
		points: 0,
		position: -1,
		password: '',
		newPassword: ''
	};
	const [accountData, setAccountData] = useState<IState>(accountDefaultData);
	const [dialogOpen, setDialogOpen] = useState<boolean>(true);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

	const handleOpen = () => setDialogOpen(true);
	const handleClose = () => setDialogOpen(false);
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleClickShowNewPassword = () =>
		setShowNewPassword(!showNewPassword);
	const handleChange = (name: string) => (
		event: ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		if (event.target) {
			setAccountData((prevState: IState) => ({
				...prevState,
				[name]: event.target.value
			}));
		}
	};

	return (
		<>
			<div className="account-info">
				<div className="account-info__background"></div>
				<Paper className="account-info__box">
					<Typography variant="h2" className="account-info__header">
						{accountData.username}
					</Typography>
					<Divider />
					<div className="account-info__avatar-part">
						<div className="account-info__avatar-img-box">
							<img
								src="/img/kenny.jpg"
								alt="user-avatar"
								className="account-info__avatar-img"
							/>
						</div>
						<div
							className="account-info__change-avatar"
							onClick={handleOpen}
						>
							Zmień swój awatar
						</div>
					</div>
					<div className="account-info__account-data-part">
						<div className="account-info__nickname-row">
							<div className="account-info__username"></div>
							<div className="account-info__change-nickname-part">
								<div
									className="account-info__change-nickname"
									onClick={handleOpen}
								>
									<TiPen /> Edytuj konto
								</div>
								<br />
								<br />
								<div className="account-info__delete-account">
									<TiTimes /> Usuń konto
								</div>
							</div>
						</div>
						<br />
						<br />
						<div>
							<Typography
								variant="h5"
								className="account-info__stats"
							>
								<strong>Nazwa klubu:</strong>{' '}
								<Link to="/klub" className="account-info__club">
									{accountData.club}
								</Link>
							</Typography>
						</div>
						<br />
						<div>
							<Typography
								variant="h5"
								className="account-info__stats"
							>
								<strong>Punkty:</strong> {accountData.points}
							</Typography>
						</div>
						<br />
						<div>
							<Typography
								variant="h5"
								className="account-info__stats"
							>
								<strong>Pozycja w rankingu:</strong>{' '}
								{accountData.position}
							</Typography>
						</div>
						<br />
						<div>
							<Typography
								variant="h5"
								className="account-info__stats"
							>
								<strong>Hasło:</strong> ***********
							</Typography>
						</div>
					</div>
				</Paper>
			</div>
			<Dialog open={dialogOpen} onClose={handleClose} className="dialog">
				<DialogTitle>
					<div className="dialog__header">
						<Typography variant="h4" className="dialog__title">
							Edycja konta
						</Typography>
						<IconButton>
							<FiX onClick={handleClose} />
						</IconButton>
					</div>
				</DialogTitle>
				<DialogContent dividers>
					<form className="dialog__form">
						<Grid container>
							<Grid item xs={7} className="dialog__form_fields">
								<FormControl className="dialog__form_field">
									<TextField
										label="Nazwa"
										required
										autoComplete="username"
										value={accountData.username}
										onChange={handleChange('username')}
									/>
								</FormControl>
								<FormControl className="dialog__form_field">
									<TextField
										label="Stare hasło"
										required
										autoComplete="current-password"
										type={
											showPassword ? 'text' : 'password'
										}
										value={accountData.password}
										onChange={handleChange('password')}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														onClick={
															handleClickShowPassword
														}
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
								<FormControl className="dialog__form_field">
									<TextField
										label="Nowe hasło"
										required
										autoComplete="new-password"
										type={
											showNewPassword
												? 'text'
												: 'password'
										}
										value={accountData.newPassword}
										onChange={handleChange('newPassword')}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														onClick={
															handleClickShowNewPassword
														}
													>
														{showNewPassword ? (
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
							</Grid>
							<Grid item xs={5}>
								<input
									type="file"
									accept="image/*"
									style={{ display: 'none' }}
									id="id-file"
								/>
								<label htmlFor="id-file">
									<div className="dialog__avatar-img-box">
										<img
											src="/img/kenny.jpg"
											alt="user-avatar"
											className="dialog__avatar-img"
										/>
									</div>
								</label>
							</Grid>
							<Grid item xs={12}>
								<Button className="btn dialog__form_button">
									Edytuj
								</Button>
							</Grid>
						</Grid>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

//do linii 41: <Typography variant="h3"> {AccountData.Username} ({AccountData.Name}) </Typography>
//do linii 75: <Link to="/zmien-haslo" className="account-info__change-pwd">Zmień hasło</Link>

export default Account;
