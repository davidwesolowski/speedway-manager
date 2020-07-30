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
import { store } from 'react-notifications-component';
import validateEditData from '../validation/validateEditData';
import { AppContext } from './AppProvider';
import { updateUser, setUser } from '../actions/userActions';

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

interface IImageData {
	name: string;
	imageBuffer: string | ArrayBuffer | null;
	imageUrl: string | ArrayBuffer | null;
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

const defaultAccountData: IState = {
	username: '',
	club: 'GKM',
	points: 0,
	position: -1,
	password: '',
	newPassword: ''
};

const defaultImageData: IImageData = {
	name: '',
	imageBuffer: '',
	imageUrl: ''
};

type NotificationType =
	| 'success'
	| 'danger'
	| 'info'
	| 'default'
	| 'warning'
	| undefined;

const addNotification = (
	title: string,
	message: string,
	type: NotificationType
) => {
	store.addNotification({
		title,
		message,
		type,
		insert: 'top',
		container: 'center',
		animationIn: ['animated', 'jackInTheBox'],
		animationOut: ['animated', 'fadeOut'],
		dismiss: {
			duration: 3000,
			showIcon: true
		}
	});
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

	const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const image = event.target.files[0];
			if (image.size <= 1048576) {
				const imageBufferReader = new FileReader();
				imageBufferReader.onload = () => {
					const { name } = image;
					setImageData({
						name,
						imageBuffer: imageBufferReader.result,
						imageUrl: ''
					});
				};
				if (image) imageBufferReader.readAsArrayBuffer(image);
				const imageUrlReader = new FileReader();
				imageUrlReader.onload = () => {
					setImageData((prevState: IImageData) => ({
						...prevState,
						imageUrl: imageUrlReader.result
					}));
				};
				if (image) imageUrlReader.readAsDataURL(image);
			} else {
				event.target.value = '';
				const title = 'Informacja!';
				const message = 'Maksymalny rozmiar awataru to 1MB!';
				const type = 'info';
				addNotification(title, message, type);
			}
		}
	};

	const removeUser = async () => {
		try {
			const cookies = new Cookies();
			const access_token = cookies.get('access_token');
			const options = {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			};
			await axios.delete(
				'https://fantasy-league-eti.herokuapp.com/users/self',
				options
			);
			cookies.remove('access_token');
			const title = 'Suckes!';
			const message = 'Pomyślne usunięcie konta!';
			const type = 'success';
			addNotification(title, message, type);
			setTimeout(() => {
				push('/rejestracja');
			}, 3000);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				const cookies = new Cookies();
				cookies.remove('access_token');
				const title = 'Błąd!';
				const message = 'Sesja wygasła!';
				const type = 'danger';
				addNotification(title, message, type);
				setTimeout(() => {
					push('/login');
				}, 3000);
			}
		}
	};

	const editData = async (data: IState, imageData: IImageData) => {
		try {
			const cookies = new Cookies();
			const access_token = cookies.get('access_token');
			const { username, password, newPassword } = data;
			const title = 'Sukces!';
			let message = '';
			const type = 'success';
			const options = {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			};
			if (username && password && newPassword) {
				await axios.patch(
					'https://fantasy-league-eti.herokuapp.com/users/self',
					{ username, password, newPassword },
					options
				);
				message = 'Pomyślna zmiana danych!';
				addNotification(title, message, type);
			} else if (password && newPassword && !username) {
				await axios.patch(
					'https://fantasy-league-eti.herokuapp.com/users/self',
					{ password, newPassword },
					options
				);
				message = 'Pomyślna zmiana hasła!';
				addNotification(title, message, type);
			} else if (username) {
				await axios.patch(
					'https://fantasy-league-eti.herokuapp.com/users/self',
					{ username },
					options
				);
				message = 'Pomyślna zmiana nazwy!';
				addNotification(title, message, type);
			}

			if (username) dispatchUserData(updateUser({ username }));

			const { name: filename, imageBuffer } = imageData;
			if (filename && imageBuffer) {
				const {
					data: { signed_url, image_url, type: content_type }
				} = await axios.post(
					'https://fantasy-league-eti.herokuapp.com/users/self/avatar',
					{ filename },
					options
				);
				const awsOptions = {
					headers: {
						'Content-Type': content_type
					}
				};
				await axios.put(signed_url, imageBuffer, awsOptions);
				message = 'Pomyślna zmiana awataru!';
				addNotification(title, message, type);
				dispatchUserData(updateUser({ avatar_url: image_url }));
			}
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				const cookies = new Cookies();
				cookies.remove('access_token');
				const title = 'Błąd!';
				const message = 'Sesja wygasła!';
				const type = 'danger';
				addNotification(title, message, type);
				setTimeout(() => {
					push('/login');
				}, 3000);
			} else if (
				data.statusCode == 400 &&
				data.message == 'Bad password.'
			) {
				const title = 'Błąd!';
				const message = 'Wprowadziłeś niepoprawne hasło!';
				const type = 'danger';
				addNotification(title, message, type);
			} else {
				console.log(e.response);
				const title = 'Błąd!';
				const message = 'Zmiana awataru nie powiodła się!';
				const type = 'danger';
				addNotification(title, message, type);
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
			const cookies = new Cookies();
			const access_token = cookies.get('access_token');
			const options = {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			};
			try {
				const {
					data: { username, email, avatar_url }
				} = await axios.get(
					'https://fantasy-league-eti.herokuapp.com/users/self',
					options
				);
				dispatchUserData(setUser({ username, email, avatar_url }));
				setLoggedIn(true);
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					const cookies = new Cookies();
					cookies.remove('access_token');
					const title = 'Błąd!';
					const message = 'Sesja wygasła!';
					const type = 'danger';
					addNotification(title, message, type);
					setTimeout(() => {
						setLoggedIn(false);
						push('/login');
					}, 3000);
				}
			}
		};

		if (!userData.email) fetchUserData();
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
							{userData.avatar_url ? (
								<img
									src={userData.avatar_url}
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
									onChange={handleFile}
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
										) : userData.avatar_url ? (
											<img
												src={userData.avatar_url}
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
