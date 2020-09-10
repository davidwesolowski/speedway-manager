/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
	FunctionComponent,
	useState,
	ChangeEvent,
	FormEvent,
	useContext,
	useEffect
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
	InputAdornment,
	DialogActions
} from '@material-ui/core';
import { Link, RouteComponentProps } from 'react-router-dom';
import { TiPen, TiTimes } from 'react-icons/ti';
import { FiX } from 'react-icons/fi';
import { MdVisibility, MdVisibilityOff, MdImage } from 'react-icons/md';
import { FaFileUpload } from 'react-icons/fa';
import { ValidationErrorItem } from '@hapi/joi';
import axios from 'axios';
import Cookies from 'universal-cookie';
import validateEditData from '../validation/validateEditData';
import { AppContext } from './AppProvider';
import { updateUser, setUser } from '../actions/userActions';
import addNotification from '../utils/addNotification';
import handleImgFile, {
	IImageData,
	defaultImageData
} from '../utils/handleImgFile';
import { checkBadAuthorization } from '../utils/checkCookies';
import getToken from '../utils/getToken';

interface IState {
	username: string;
	club: string;
	points: number;
	position: number;
	password: string;
	newPassword: string;
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

const defaultValidateData: IValidateData = {
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

const defaultAccountData: IState = {
	username: '',
	club: 'Apator',
	points: 0,
	position: -1,
	password: '',
	newPassword: ''
};

const Account: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {
	const [accountData, setAccountData] = useState<IState>(defaultAccountData);
	const [validateData, setValidateData] = useState<IValidateData>(
		defaultValidateData
	);
	const [imageData, setImageData] = useState<IImageData>(defaultImageData);
	const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
	const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
	const { userData, dispatchUserData, setLoggedIn } = useContext(AppContext);

	const handleEditOpen = () => setEditDialogOpen(true);
	const handleEditClose = () => {
		setValidateData(defaultValidateData);
		setAccountData(defaultAccountData);
		setImageData(defaultImageData);
		setEditDialogOpen(false);
		setShowPassword(false);
		setShowNewPassword(false);
	};
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleClickShowNewPassword = () =>
		setShowNewPassword(!showNewPassword);

	const handleRemoveOpen = () => setRemoveDialogOpen(true);
	const handleRemoveClose = () => setRemoveDialogOpen(false);

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

	const removeUser = async () => {
		try {
			const cookies = new Cookies();
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			await axios.delete(
				'https://fantasy-league-eti.herokuapp.com/users/self',
				options
			);
			cookies.remove('accessToken');
			const title = 'Suckes!';
			const message = 'Pomyślne usunięcie konta!';
			const type = 'success';
			const duration = 1500;
			addNotification(title, message, type, duration);
			setTimeout(() => {
				setLoggedIn(false);
				push('/rejestracja');
			}, duration);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			}
		}
	};

	const editData = async (data: IState, imageData: IImageData) => {
		try {
			const accessToken = getToken();
			const { username, password, newPassword } = data;
			const title = 'Sukces!';
			let message = '';
			const type = 'success';
			const duration = 3000;
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			if (username && password && newPassword) {
				await axios.patch(
					'https://fantasy-league-eti.herokuapp.com/users/self',
					{ username, password, newPassword },
					options
				);
				message = 'Pomyślna zmiana danych!';
				addNotification(title, message, type, duration);
			} else if (password && newPassword && !username) {
				await axios.patch(
					'https://fantasy-league-eti.herokuapp.com/users/self',
					{ password, newPassword },
					options
				);
				message = 'Pomyślna zmiana hasła!';
				addNotification(title, message, type, duration);
			} else if (username) {
				await axios.patch(
					'https://fantasy-league-eti.herokuapp.com/users/self',
					{ username },
					options
				);
				message = 'Pomyślna zmiana nazwy!';
				addNotification(title, message, type, duration);
			}

			if (username) dispatchUserData(updateUser({ username }));

			const { name: filename, imageBuffer } = imageData;
			if (filename && imageBuffer) {
				const {
					data: { signedUrl, imageUrl, type }
				} = await axios.post(
					'https://fantasy-league-eti.herokuapp.com/users/self/avatar',
					{ filename },
					options
				);
				const awsOptions = {
					headers: {
						'Content-Type': type
					}
				};
				await axios.put(signedUrl, imageBuffer, awsOptions);
				message = 'Pomyślna zmiana awataru!';
				addNotification(title, message, type, duration);
				dispatchUserData(updateUser({ avatarUrl: imageUrl }));
			}
		} catch (e) {
			const {
				response: { data }
			} = e;
			const title = 'Błąd!';
			const type = 'danger';
			const duration = 3000;
			let message: string;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else if (
				data.statusCode == 400 &&
				data.message == 'Bad password.'
			) {
				message = 'Wprowadziłeś niepoprawne hasło!';
				addNotification(title, message, type, duration);
			} else {
				message = 'Zmiana awataru nie powiodła się!';
				addNotification(title, message, type, duration);
			}
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
			editData(accountData, imageData);
		}
	};

	useEffect(() => {
		const fetchUserData = async () => {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			try {
				const {
					data: { _id, username, email, avatarUrl }
				} = await axios.get(
					'https://fantasy-league-eti.herokuapp.com/users/self',
					options
				);
				dispatchUserData(setUser({ _id, username, email, avatarUrl }));
				setLoggedIn(true);
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				}
			}
		};

		if (!userData.email) fetchUserData();
		setTimeout(() => {
			document.body.style.overflow = 'auto';
		}, 2000);
	}, []);

	return (
		<>
			<div className="account-info">
				<div className="account-info__background"></div>
				<Paper className="account-info__box">
					<Typography variant="h2" className="account-info__header">
						{userData.username}
					</Typography>
					<Divider />
					<div className="account-info__avatar-part">
						<div className="account-info__avatar-img-box">
							{userData.avatarUrl ? (
								<img
									src={userData.avatarUrl}
									alt="user-avatar"
									className="account-info__avatar-img"
								/>
							) : (
								<MdImage />
							)}
						</div>
						<div
							className="account-info__change-avatar"
							onClick={handleEditOpen}
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
									onClick={handleEditOpen}
								>
									<TiPen /> Edytuj konto
								</div>
								<br />
								<br />
								<div
									className="account-info__delete-account"
									onClick={handleRemoveOpen}
								>
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
			<Dialog
				open={editDialogOpen}
				onClose={handleEditClose}
				className="dialog"
			>
				<DialogTitle>
					<div className="dialog__header">
						<Typography variant="h4" className="dialog__title">
							Edycja konta
						</Typography>
						<IconButton onClick={handleEditClose}>
							<FiX />
						</IconButton>
					</div>
				</DialogTitle>
				<DialogContent dividers>
					<form
						className="dialog__form"
						onSubmit={handleOnSubmit}
						encType="multipart/form-data"
					>
						<Grid container>
							<Grid item xs={7} className="dialog__form_fields">
								<FormControl className="dialog__form_field">
									<TextField
										label="Nazwa"
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
									onChange={handleImgFile(setImageData)}
									id="id-file"
								/>
								<label htmlFor="id-file">
									<div className="dialog__avatar-img-box">
										{imageData.imageUrl ? (
											<img
												src={
													imageData.imageUrl as string
												}
												alt="user-avatar"
												className="dialog__avatar-img"
											/>
										) : userData.avatarUrl ? (
											<img
												src={userData.avatarUrl}
												alt="user-avatar"
												className="dialog__avatar-img"
											/>
										) : (
											<FaFileUpload className="dialog__avatar-upload" />
										)}
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
						</Grid>
					</form>
				</DialogContent>
			</Dialog>
			<Dialog open={removeDialogOpen} onClose={handleRemoveClose}>
				<DialogTitle>
					<div>
						<Typography variant="h4" className="dialog__title">
							Czy na pewno chcesz usunąć swoje konto?
						</Typography>
					</div>
				</DialogTitle>
				<DialogActions>
					<Button className="btn" onClick={handleRemoveClose}>
						Anuluj
					</Button>
					<Button
						className="btn dialog__button-approve"
						onClick={removeUser}
					>
						Usuń
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Account;
