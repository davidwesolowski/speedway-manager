import React, { FunctionComponent, useState, useEffect } from 'react';
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
	Checkbox,
	Select,
	MenuItem,
} from '@material-ui/core';
import { FiPlus, FiX } from 'react-icons/fi';
import axios from 'axios';
import validateRiderData from '../validation/validateRiderData';
import { ValidationErrorItem } from '@hapi/joi';
import RidersList from '../components/RidersList';
import addNotification from '../utils/addNotification';
import { RouteComponentProps } from 'react-router-dom';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import getToken from '../utils/getToken';
import { useStateValue } from './AppProvider';
import handleImgFile, {
	IImageData,
	defaultImageData
} from '../utils/handleImgFile';
import { FaFileUpload } from 'react-icons/fa';
import fetchUserData from '../utils/fetchUserData';
import checkAdminRole from '../utils/checkAdminRole';
import { checkBadAuthorization } from '../utils/checkCookies';

interface IRider {
	firstName: string;
	lastName: string;
	nickname: string;
	dateOfBirth: Date;
	isForeigner: boolean;
	KSM: number;
	clubId: string;
}

interface IRider1 {
	firstName: string;
	lastName: string;
	nickname: string;
	dateOfBirth: Date;
	isForeigner: boolean;
	isJunior: boolean;
	// ksm: number;
	//   club: string;
}

interface IValidatedData {
	firstName: {
		message: string;
		error: boolean;
	};
	lastName: {
		message: string;
		error: boolean;
	};
	nickname: {
		message: string;
		error: boolean;
	};
	dateOfBirth: {
		message: string;
		error: boolean;
	};
	isForeigner: {
		message: string;
		error: boolean;
	};
	KSM: {
		message: string;
		error: boolean;
	};
	clubId: {
		message: string;
		error: boolean;
	};
}

interface IRiderPass {
	id: string;
	imię: string;
	nazwisko: string;
	przydomek: string;
	data_urodzenia: Date;
	zagraniczny: boolean;
	ksm: number;
	klubId: string;
	image: string;
}

const Riders: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {
	const { setLoggedIn, dispatchUserData, userData } = useStateValue();

	const [imageData, setImageData] = useState<IImageData>(defaultImageData);

	const [riders, setRiders] = useState<IRiderPass[]>([]);

	const defaultValidatedData = {
		firstName: {
			message: '',
			error: false
		},
		lastName: {
			message: '',
			error: false
		},
		nickname: {
			message: '',
			error: false
		},
		dateOfBirth: {
			message: '',
			error: false
		},
		isForeigner: {
			message: '',
			error: false
		},
		KSM: {
			message: '',
			error: false
		},
		clubId: {
			message: '',
			error: false
		}
	};

	const [clubs, setClubs] = useState([]);

	const getClubs = async () => {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		const { data } = await axios.get(
			'https://fantasy-league-eti.herokuapp.com/clubs',
			options
		);
		setClubs(data);
	};

	const defaultRiderData = {
		firstName: '',
		lastName: '',
		nickname: '',
		dateOfBirth: new Date(2000, 0, 1),
		isForeigner: true,
		KSM: 2.5,
		clubId: ''
	};

	const [riderData, setRiderData] = useState<IRider>(defaultRiderData);
	const [validatedData, setValidatedData] = useState<IValidatedData>(
		defaultValidatedData
	);
	const [showDialog, setShowDialog] = useState<boolean>(false);

	const [tempKSM, setTempKSM] = useState<string>('');

	const handleOpen = () => setShowDialog(true);
	const handleClose = () => {
		setValidatedData(defaultValidatedData);
		setShowDialog(false);
		setRiderData(defaultRiderData);
		setImageData(defaultImageData);
	};

	const handleOnChange = (name: string) => (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		if (event.target) {
			if (name === 'KSM') {
				setTempKSM(event.target.value);
				setRiderData((prevState: IRider) => ({
					...prevState,
					[name]: parseFloat(tempKSM)
				}));
			} else {
				setRiderData((prevState: IRider) => ({
					...prevState,
					[name]: event.target.value
				}));
			}
		}
	};

	const handleOnChangeCheckbox = event => {
		event.persist();
		if (event.target) {
			setRiderData((prevState: IRider) => ({
				...prevState,
				isForeigner: !event.target.checked
			}));
		}
	};

	const handleDateOnChange = date => {
		setRiderData((prevState: IRider) => ({
			...prevState,
			dateOfBirth: date
		}));
	};

	const handleOnChangeClub = (name: string) => event => {
		event.persist();
		if (event.target) {
			setRiderData((prevState: IRider) => ({
				...prevState,
				[name]: event.target.value
			}));
		}
	};

	const deleteRider = async (id) => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.delete(
				`https://fantasy-league-eti.herokuapp.com/riders/${id}`,
				options
			);
			addNotification(
				'Sukces!',
				'Udało się usunąć zawodnika!',
				'success',
				1000
			);
			setRiders(riders.filter(rider => rider.id !== id));
		} catch (e) {
			const {
                response: { data }
            } = e;
			if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            } else {
				addNotification(
					'Błąd!',
					'Nie udało się usunąć zawodnika!',
					'danger',
					1000
				);
			}
			throw new Error('Error in deleting riders!');
		}
	}

	
	const getRiders = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/riders',
				options
			);
			setRiders([]);
			data.map(rider => {
				setRiders(riders =>
					riders.concat({
						id: rider._id,
						imię: rider.firstName,
						nazwisko: rider.lastName,
						przydomek: rider.nickname,
						data_urodzenia: rider.dateOfBirth,
						zagraniczny: rider.isForeigner,
						ksm: rider.KSM,
						klubId: rider.clubId,
						image: rider.image
					})
				);
			});
		} catch (e) {
			const {
                response: { data }
            } = e;
			if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            } else {
				addNotification(
					'Błąd!',
					'Nie udało się usunąć zawodnika!',
					'danger',
					1000
				);
			}
			throw new Error('Error in deleting riders!');
		}
	}

	const addRider = async (riderData: IRider) => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.post(
				'https://fantasy-league-eti.herokuapp.com/riders',
				riderData,
				options
			);
			const id = data._id;
			const { name: filename, imageBuffer } = imageData;
			if (filename && imageBuffer) {
				const {
					data: { signedUrl, imageUrl, type }
				} = await axios.post(
					`https://fantasy-league-eti.herokuapp.com/riders/${data._id}/image`,
					{ filename },
					options
				);
				const awsOptions = {
					headers: {
						'Content-Type': type
					}
				};
				await axios.put(signedUrl, imageBuffer, awsOptions);
			}
			addNotification(
				'Sukces',
				'Poprawnie dodano zawodnika',
				'success',
				1000
			);
			setValidatedData(defaultValidatedData);
			setRiderData(defaultRiderData);
			setTimeout(() => {
				{
					handleClose();
				}
			}, 10);
			setRiders(riders =>
				riders.concat({
					id: id,
					imię: riderData.firstName,
					nazwisko: riderData.lastName,
					przydomek: riderData.nickname,
					data_urodzenia: riderData.dateOfBirth,
					zagraniczny: riderData.isForeigner,
					ksm: riderData.KSM,
					klubId: riderData.clubId,
					image: '',
				}));
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else if (data.statusCode == 404) {
				addNotification(
					'Błąd!',
					'Podany zawodnik już istnieje w bazie!',
					'danger',
					1000
				);
			} else {
				addNotification(
					'Błąd!',
					'Nie udało się dodać zawodnika!',
					'danger',
					1000
				);
			}
		}
	};

	const handleOnSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const validationResponse = validateRiderData(riderData);
		if (validationResponse.error) {
			setValidatedData(() => defaultValidatedData);
			validationResponse.error.details.forEach(
				(errorItem: ValidationErrorItem): any => {
					setValidatedData((prevState: IValidatedData) => {
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
			const {
				firstName,
				lastName,
				nickname,
				dateOfBirth,
				isForeigner,
				KSM,
				clubId
			} = riderData;
			addRider({
				firstName,
				lastName,
				nickname,
				dateOfBirth,
				isForeigner,
				KSM,
				clubId
			});
		}
	};

	useEffect(() => {
		(async function () {
			try {
				await getClubs();
				await getRiders();
				if (!userData.username)
					await fetchUserData(dispatchUserData, setLoggedIn, push);
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				} else {
					addNotification(
						'Błąd',
						'Nie udało się pobrać klubów z bazy',
						'danger',
						3000
					);
				}
			}
			setTimeout(() => {
				document.body.style.overflow = 'auto';
			}, 500);
		})();
	}, []);

	return (
		<>
			<div className="riders">
				<div className="riders__background"></div>
				<Paper className="riders__box">
					<Typography variant="h2" className="riders__header">
						Zawodnicy
					</Typography>
					<Divider />
					{checkAdminRole(userData.role) && (
						<IconButton
							className="riders__fiplus"
							onClick={handleOpen}
						>
							<FiPlus />
						</IconButton>
					)}
					<RidersList riders={riders} deleteRider={deleteRider}/>
				</Paper>
			</div>
			<Dialog open={showDialog} onClose={handleClose} className="dialog">
				<DialogTitle>
					<div className="dialog__header">
						<Typography variant="h4" className="dialog__title">
							Dodawanie zawodnika
						</Typography>
						<IconButton
							onClick={handleClose}
							className="riders__fix"
						>
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
										label="Imię"
										required
										autoComplete="first_name"
										value={riderData.firstName}
										error={validatedData.firstName.error}
										helperText={
											validatedData.firstName.message
										}
										onChange={handleOnChange('firstName')}
									/>
								</FormControl>
								<FormControl className="dialog__form_field">
									<TextField
										label="Nazwisko"
										required
										autoComplete="last_name"
										value={riderData.lastName}
										error={validatedData.lastName.error}
										helperText={
											validatedData.lastName.message
										}
										onChange={handleOnChange('lastName')}
									/>
								</FormControl>
								<FormControl className="dialog__form_field">
									<TextField
										label="Przydomek"
										autoComplete="nickname"
										value={riderData.nickname}
										error={validatedData.nickname.error}
										helperText={
											validatedData.nickname.message
										}
										onChange={handleOnChange('nickname')}
									/>
								</FormControl>
								<FormControl className="dialog__form_field_date">
									Data urodzenia:
									<MuiPickersUtilsProvider
										utils={DateFnsUtils}
									>
										<KeyboardDatePicker
											margin="normal"
											id="date-picker-dialog"
											format="dd/MM/yyyy"
											value={
												new Date(riderData.dateOfBirth)
											}
											onChange={handleDateOnChange}
											KeyboardButtonProps={{
												'aria-label': 'change date'
											}}
										/>
									</MuiPickersUtilsProvider>
								</FormControl>
								<br />
								<FormControl className="dialog__checkbox">
									Polak:
									<Checkbox
										onChange={handleOnChangeCheckbox}
										size="small"
										className="checkbox"
										title="Zaznacz jeśli zawodnik jest Polakiem"
									/>
								</FormControl>
								<FormControl className="dialog__form_field">
									<TextField
										label="KSM"
										required
										autoComplete="ksm"
										value={tempKSM}
										error={validatedData.KSM.error}
										helperText={validatedData.KSM.message}
										onChange={handleOnChange('KSM')}
									/>
								</FormControl>
								<FormControl className="dialog__form_field_club">
									Klub:
									<Select
										value={riderData.clubId || ''}
										onChange={handleOnChangeClub('clubId')}
									>
										{clubs.map((club, index) => (
											<MenuItem
												key={index}
												value={club._id}
											>
												{club.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={5}>
								<input
									type="file"
									accept="image/*"
									style={{ display: 'none' }}
									onChange={handleImgFile(setImageData)}
									id="id-file"
									required
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
									Dodaj
								</Button>
							</Grid>
						</Grid>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Riders;
