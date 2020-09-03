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
	MenuItem
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
import { setUser } from '../actions/userActions';
import handleImgFile, {
	IImageData,
	defaultImageData
} from '../utils/handleImgFile';
import { FaFileUpload } from 'react-icons/fa';

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

const Riders: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {

	const {
        setLoggedIn,
		dispatchUserData,
		userData,
    } = useStateValue();
    
    const fetchUserData = async () => {
        const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
        try {
            const {
                data: { username, email, avatarUrl }
            } = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/users/self',
                options
            );
            dispatchUserData(setUser({ username, email, avatarUrl }));
            setLoggedIn(true);
        } catch (e) {
            /*const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            }*/
        }
	};
	
	const [imageData, setImageData] = useState<IImageData>(defaultImageData);

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
	
	const refreshPage = () => {
		window.location.reload(false);
	};
	
	const [clubs, setClubs] = useState([])
	
	const getClubs = async () => {
		try {
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
			setClubs(
				data
			);
		} catch (e) {
			console.log(e.response);
			if (e.response.statusText == 'Unauthorized') {
				addNotification('Błąd', 'Sesja wygasła', 'danger', 3000);
				setTimeout(() => {
					push('/login');
				}, 3000);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się pobrać klubów z bazy',
					'danger',
					3000
				);
			}
			throw new Error('Error in getting clubs');
		}
	}
	
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

	const [exampleRiders, setExampleRiders] = useState<IRider1[]>([
		{
			firstName: 'Chris',
			lastName: 'Holder',
			nickname: 'Crispy',
			dateOfBirth: new Date(1980, 1, 1),
			isForeigner: true,
			isJunior: false
		},
		{
			firstName: 'Jack',
			lastName: 'Holder',
			nickname: 'Jackie',
			dateOfBirth: new Date(1980, 1, 1),
			isForeigner: true,
			isJunior: false
		},
		{
			firstName: 'Victor',
			lastName: 'Kulakov',
			nickname: '',
			dateOfBirth: new Date(1980, 1, 1),
			isForeigner: true,
			isJunior: false
		},
		{
			firstName: 'Tai',
			lastName: 'Woffinden',
			nickname: 'Woffy',
			dateOfBirth: new Date(1980, 1, 1),
			isForeigner: true,
			isJunior: false
		},
		{
			firstName: 'Tobiasz',
			lastName: 'Musielak',
			nickname: 'Tofik',
			dateOfBirth: new Date(1980, 1, 1),
			isForeigner: false,
			isJunior: false
		},
		{
			firstName: 'Adrian',
			lastName: 'Miedziński',
			nickname: 'Miedziak',
			dateOfBirth: new Date(1980, 1, 1),
			isForeigner: false,
			isJunior: false
		},
		{
			firstName: 'Maciej',
			lastName: 'Janowski',
			nickname: 'Magic',
			dateOfBirth: new Date(1980, 1, 1),
			isForeigner: false,
			isJunior: false
		},
		{
			firstName: 'Maksym',
			lastName: 'Drabik',
			nickname: '',
			dateOfBirth: new Date(1980, 1, 1),
			isForeigner: false,
			isJunior: false
		},
		{
			firstName: 'Piotr',
			lastName: 'Protasiewicz',
			nickname: 'Protas',
			dateOfBirth: new Date(1980, 1, 1),
			isForeigner: false,
			isJunior: false
		},
		{
			firstName: 'Gleb',
			lastName: 'Chugunov',
			nickname: '',
			dateOfBirth: new Date(2000, 1, 1),
			isForeigner: false,
			isJunior: true
		},
		{
			firstName: 'Igor',
			lastName: 'Sobczyński',
			nickname: '',
			dateOfBirth: new Date(2000, 1, 1),
			isForeigner: false,
			isJunior: true
		},
		{
			firstName: 'Kamil',
			lastName: 'Marciniec',
			nickname: '',
			dateOfBirth: new Date(2000, 1, 1),
			isForeigner: false,
			isJunior: true
		},
		{
			firstName: 'Aleks',
			lastName: 'Rydlewski',
			nickname: '',
			dateOfBirth: new Date(2000, 1, 1),
			isForeigner: false,
			isJunior: true
		}
	]);

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
			if(name === 'KSM')
			{
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
		console.log(!event.target.checked);
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

	const handleOnChangeClub = (name: string) => (
        event
    ) => {
		event.persist();
		console.log("Zmiana klubu");
		console.log(event.target.value);
        if (event.target) {
            setRiderData((prevState: IRider) => ({
                ...prevState,
                [name]: event.target.value
            }));
        }
    };

	/*const addRiders = async (riderData: IRider1) => {
        try {
            console.log("Dodawanie zawodnika");
            const cookies = new Cookies();
            const access_token = cookies.get("access_token");
            const options = {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            };
            const {
                data
            } = await axios.post(
                'https://fantasy-league-eti.herokuapp.com/riders',
                riderData,
                options
            );
            addNotification("Sukces", "Poprawnie dodano zawodnika", "success", 1000);
            setValidatedData(defaultValidatedData);
            setRiderData(defaultRiderData); 
            setTimeout(() => {
                {handleClose()};
            }, 10);
            setTimeout(() => {
                {refreshPage()};
            }, 1000);
        } catch (e) {
            if(e.statusText == "Bad Request")
            {
                addNotification("Błąd!", "Podany zawodnik już istnieje w bazie!", "danger",1000);
                setTimeout(() => {
                }, 1000);
            }
            else if(e.statusText == "Unauthorized")
            {
                addNotification("Błąd!", "Twoja sesja wygasła", "danger", 1000);
                setTimeout(() => {
                    push('/login');
                }, 1000);
            }
            else
            {
                addNotification("Błąd!", "Nie udało się dodać zawodnika!", "danger",1000);
            }
            throw new Error('Error in adding new rider!');
        }
    };*/

	const addRider = async (riderData: IRider) => {
		try {
			console.log('Dodawanie zawodnika');
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
			setTimeout(() => {
				{
					refreshPage();
				}
			}, 1000);
		} catch (e) {
			console.log(e.response);
			if (e.statusText == 'Bad Request') {
				addNotification(
					'Błąd!',
					'Podany zawodnik już istnieje w bazie!',
					'danger',
					1000
				);
				setTimeout(() => {}, 1000);
			} else if (e.statusText == 'Unauthorized') {
				addNotification('Błąd!', 'Twoja sesja wygasła', 'danger', 1000);
				setTimeout(() => {
					push('/login');
				}, 1000);
			} else {
				addNotification(
					'Błąd!',
					'Nie udało się dodać zawodnika!',
					'danger',
					1000
				);
			}
			throw new Error('Error in adding new rider!');
		}
	};

	const handleOnSubmit = (event: React.FormEvent) => {
		console.log('Submit');
		event.preventDefault();
		const validationResponse = validateRiderData(riderData);
		if (validationResponse.error) {
			console.log('ERROR');
			setValidatedData(() => defaultValidatedData);
			validationResponse.error.details.forEach(
				(errorItem: ValidationErrorItem): any => {
					console.log(errorItem.message);
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
			console.log('Add rider start');
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

	/*useEffect(() => {
        exampleRiders.map(rider => addRiders(rider));
	}, [])*/

	const clubsData = [{
		name: 'Fogo Unia Leszno'
	},{
		name: 'Apator Toruń'
	},{
		name: 'Betard Sparta Wrocław'
	},{
		name: 'Motor Lublin'
	}];

	const addClubsTemp = async (club) => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.post(
				'https://fantasy-league-eti.herokuapp.com/clubs',
				club,
				options
			);
			addNotification(
				'Sukces',
				'Poprawnie dodano klub',
				'success',
				1000
			);
		} catch (e) {
			if (e.statusText == 'Bad Request') {
				addNotification(
					'Błąd!',
					'Podany klub już istnieje w bazie!',
					'danger',
					1000
				);
				setTimeout(() => {}, 1000);
			} else if (e.statusText == 'Unauthorized') {
				addNotification('Błąd!', 'Twoja sesja wygasła', 'danger', 1000);
				setTimeout(() => {
					push('/login');
				}, 1000);
			} else {
				addNotification(
					'Błąd!',
					'Nie udało się dodać klubu!',
					'danger',
					1000
				);
			}
			throw new Error('Error in adding new rider!');
		}
	}

	useEffect(() => {
		getClubs();
		if (!userData.username) fetchUserData();
		setTimeout(() => {
			document.body.style.overflow = 'auto';
		}, 500);
		/*clubsData.map((club, index) => {
			addClubsTemp(club);
		})*/
    }, [])

	return (
		<>
			<div className="riders">
				<div className="riders__background"></div>
				<Paper className="riders__box">
					<Typography variant="h2" className="riders__header">
						Zawodnicy
					</Typography>
					<Divider />
					<IconButton className="riders__fiplus" onClick={handleOpen}>
						<FiPlus />
					</IconButton>
					<RidersList />
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
									<Select value={riderData.clubId || ''} onChange={handleOnChangeClub('clubId')}>
											{clubs.map((club, index) => 
												<MenuItem key={index} value={club._id}>{club.name}</MenuItem>
											)}
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

/*
<FormControl className="dialog__form_field_club">
    Klub:
    <select value={riderData.club} onChange={handleOnChangeClub('club')} className="dialog__choose_list">
        <option value="Fogo Unia Leszno">Fogo Unia Leszno</option>
        <option value="forBet Włókniarz Częstochowa">forBet Włókniarz Częstochowa</option>
        <option value="RM Solar Falubaz Zielona Góra">RM Solar Falubaz Zielona Góra</option>
        <option value="Motor Lublin">Motor Lublin</option>
        <option value="Betard Sparta Wrocław">Betard Sparta Wrocław</option>
        <option value="MRGARDEN GKM Grudziądz">MRGARDEN GKM Grudziądz</option>
        <option value="Moje Bermudy Stal Gorzów">Moje Bermudy Stal Gorzów</option>
        <option value="PGG ROW Rybnik">PGG ROW Rybnik</option>
    </select>
</FormControl>
*/
