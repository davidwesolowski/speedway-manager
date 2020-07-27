/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
	FunctionComponent,
	useState,
	ChangeEvent,
	FormEvent
} from 'react';
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
import Alert from '@material-ui/lab/Alert';
import { TiPen, TiTimes } from 'react-icons/ti';
import { FiX } from 'react-icons/fi';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { ValidationErrorItem } from '@hapi/joi';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import validateEditData from '../validation/validateEditData';

interface IState {
	username: string;
	club: string;
	points: number;
	position: number;
	password: string;
	newPassword: string;
	image: string | Blob | ProgressEvent<FileReader>;
}

interface IValidateData {
	username: {
		message: string;
		error: boolean;
	};
	password: {
		message: string;
		error: boolean;
	};
	newPassword: {
		message: string;
		error: boolean;
	};
}

const defaultValidateData = {
	username: {
		message: '',
		error: false
	},
	password: {
		message: '',
		error: false
	},
	newPassword: {
		message: '',
		error: false
	}
};

const defaultAccountData = {
	username: 'Testowy',
	club: 'GKM',
	points: 0,
	position: -1,
	password: '',
	newPassword: '',
	image: ''
};

const Account: FunctionComponent = () => {
	const [accountData, setAccountData] = useState<IState>(defaultAccountData);
	const [validateData, setValidateData] = useState<IValidateData>(
		defaultValidateData
	);
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);

	const handleOpen = () => setDialogOpen(true);
	const handleClose = () => {
		setValidateData(defaultValidateData);
		setAccountData(defaultAccountData);
		setDialogOpen(false);
		setShowPassword(false);
		setShowNewPassword(false);
	};
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleClickShowNewPassword = () =>
		setShowNewPassword(!showNewPassword);

	const handleOnChange = (name: string) => (
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

	const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const image = event.target.files[0];
			const imageReader = new FileReader();
			imageReader.onload = () => {
				const imageExtension = image.name.split('.')[1].toUpperCase();
				let compressFormat: string;
				if (imageExtension == 'JPG' || imageExtension == 'JPEG')
					compressFormat = 'JPEG';
				else if (imageExtension == 'PNG') compressFormat = 'PNG';
				else compressFormat = 'WEBP';

				Resizer.imageFileResizer(
					image,
					400,
					400,
					compressFormat,
					100,
					0,
					uri => {
						setAccountData((prevState: IState) => ({
							...prevState,
							image: uri
						}));
					},
					'base64'
				);
			};
		}
	};

	const editData = async (data: IState) => {
		try {
			const { username, password, newPassword, image } = data;
			const resultUser = await axios.patch(
				'https://fantasy-league-eti.herokuapp.com/users/self',
				{ username, password, newPassword }
			);
			const resultAvatar = await axios.patch(
				'https://fantasy-league-eti.herokuapp.com/users/self/avatar',
				image
			);
			setError(false);
			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
			}, 1000);
		} catch (e) {
			setSuccess(false);
			setError(true);
			console.log(e);
		}
	};

	const handleOnSubmit = (event: FormEvent) => {
		event.preventDefault();
		const { username, password, newPassword } = accountData;
		const validationResult = validateEditData({
			username,
			password,
			newPassword
		});
		if (validationResult.error) {
			setValidateData(() => defaultValidateData);
			validationResult.error.details.forEach(
				(errorItem: ValidationErrorItem) => {
					setValidateData((prevState: IValidateData) => {
						if (errorItem.path[0] != 'username') {
							return {
								...prevState,
								[errorItem.path[0]]: {
									message:
										'Hasło musi mieć przynajmniej 8 znaków, zawierać co najmniej jedną wielką literę i jeden znak specjalny!',
									error: true
								}
							};
						}

						return {
							...prevState,
							[errorItem.path[0]]: {
								message: errorItem.message,
								error: true
							}
						};
					});
				}
			);
		} else {
			console.log('wchodzi');
			editData(accountData);
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
						<IconButton onClick={handleClose}>
							<FiX />
						</IconButton>
					</div>
				</DialogTitle>
				<DialogContent dividers>
					<form className="dialog__form" onSubmit={handleOnSubmit}>
						<Grid container>
							<Grid item xs={7} className="dialog__form_fields">
								<FormControl className="dialog__form_field">
									<TextField
										label="Nazwa"
										required
										autoComplete="username"
										value={accountData.username}
										error={validateData.username.error}
										helperText={
											validateData.username.message
										}
										onChange={handleOnChange('username')}
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
										error={validateData.password.error}
										helperText={
											validateData.password.message
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
										onChange={handleOnChange('newPassword')}
										error={validateData.newPassword.error}
										helperText={
											validateData.newPassword.message
										}
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
									onChange={handleFile}
									id="id-file"
								/>
								<label htmlFor="id-file">
									<div className="dialog__avatar-img-box">
										<img
											src="/img/kenny.jpg"
											alt="user-avatar"
											className="dialog__avatar-img"
										/>
										<div className="dialog__avatar-edit">
											Edytuj
										</div>
									</div>
								</label>
							</Grid>
							<Grid item xs={12}>
								<Button
									className="btn dialog__form_button"
									type="submit"
								>
									Edytuj
								</Button>
							</Grid>
							<Grid item xs={12}>
								{success && (
									<Alert
										severity="success"
										variant="outlined"
									>
										Edycja zakończona powodzeniem!
									</Alert>
								)}
								{error && (
									<Alert severity="error" variant="outlined">
										Edycja zakończona niepowodzeniem!
									</Alert>
								)}
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
