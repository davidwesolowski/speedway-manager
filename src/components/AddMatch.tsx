import React, { FunctionComponent, useState, useEffect } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import {
	Paper,
	Typography,
	Divider,
	Button,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Dialog,
	DialogTitle,
	IconButton,
	DialogContent,
	Grid,
	FormControl,
	Checkbox,
	CircularProgress
} from '@material-ui/core';
import { FiX } from 'react-icons/fi';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import getToken from '../utils/getToken';
import axios from 'axios';
import addNotification from '../utils/addNotification';
import validateRoundData from '../validation/validateRoundData';
import { ValidationErrorItem } from '@hapi/joi';
import { useStateValue } from './AppProvider';
import validateMatchPointsData from '../validation/validateMatchPointsData';
import { checkBadAuthorization } from '../utils/checkCookies';
import checkAdminRole from '../utils/checkAdminRole';
import fetchUserData from '../utils/fetchUserData';

interface IRiderPoints {
	_id: string;
	points: number;
	heats: number;
}

interface IRoundCreate {
	startDate: Date;
	endDate: Date;
	number: number;
}

interface ITeamPoints {
	team_id: string;
	rider_1: IRiderPoints;
	rider_2: IRiderPoints;
	rider_3: IRiderPoints;
	rider_4: IRiderPoints;
	rider_5: IRiderPoints;
	rider_6: IRiderPoints;
	rider_7: IRiderPoints;
	rider_8: IRiderPoints;
}

interface ITeamPointsToValidate {
	home_id: string;
	away_id: string;
	points_1: number;
	points_2: number;
	points_3: number;
	points_4: number;
	points_5: number;
	points_6: number;
	points_7: number;
	points_8: number;
	points_9: number;
	points_10: number;
	points_11: number;
	points_12: number;
	points_13: number;
	points_14: number;
	points_15: number;
	points_16: number;
	heats_1: number;
	heats_2: number;
	heats_3: number;
	heats_4: number;
	heats_5: number;
	heats_6: number;
	heats_7: number;
	heats_8: number;
	heats_9: number;
	heats_10: number;
	heats_11: number;
	heats_12: number;
	heats_13: number;
	heats_14: number;
	heats_15: number;
	heats_16: number;
}

interface IValidatedPoints {
	home_id: {
		message: string;
		error: boolean;
	};
	away_id: {
		message: string;
		error: boolean;
	};
	points_1: {
		message: string;
		error: boolean;
	};
	points_2: {
		message: string;
		error: boolean;
	};
	points_3: {
		message: string;
		error: boolean;
	};
	points_4: {
		message: string;
		error: boolean;
	};
	points_5: {
		message: string;
		error: boolean;
	};
	points_6: {
		message: string;
		error: boolean;
	};
	points_7: {
		message: string;
		error: boolean;
	};
	points_8: {
		message: string;
		error: boolean;
	};
	points_9: {
		message: string;
		error: boolean;
	};
	points_10: {
		message: string;
		error: boolean;
	};
	points_11: {
		message: string;
		error: boolean;
	};
	points_12: {
		message: string;
		error: boolean;
	};
	points_13: {
		message: string;
		error: boolean;
	};
	points_14: {
		message: string;
		error: boolean;
	};
	points_15: {
		message: string;
		error: boolean;
	};
	points_16: {
		message: string;
		error: boolean;
	};
	heats_1: {
		message: string;
		error: boolean;
	};
	heats_2: {
		message: string;
		error: boolean;
	};
	heats_3: {
		message: string;
		error: boolean;
	};
	heats_4: {
		message: string;
		error: boolean;
	};
	heats_5: {
		message: string;
		error: boolean;
	};
	heats_6: {
		message: string;
		error: boolean;
	};
	heats_7: {
		message: string;
		error: boolean;
	};
	heats_8: {
		message: string;
		error: boolean;
	};
	heats_9: {
		message: string;
		error: boolean;
	};
	heats_10: {
		message: string;
		error: boolean;
	};
	heats_11: {
		message: string;
		error: boolean;
	};
	heats_12: {
		message: string;
		error: boolean;
	};
	heats_13: {
		message: string;
		error: boolean;
	};
	heats_14: {
		message: string;
		error: boolean;
	};
	heats_15: {
		message: string;
		error: boolean;
	};
	heats_16: {
		message: string;
		error: boolean;
	};
}

interface IValidatedRound {
	number: {
		message: string;
		error: boolean;
	};
	startDate: {
		message: string;
		error: boolean;
	};
	endDate: {
		message: string;
		error: boolean;
	};
}

const AddMatch: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {
	const { setLoggedIn, dispatchUserData, userData } = useStateValue();

	const defaultRiderPoints = {
		_id: '',
		points: 0,
		heats: 0
	};

	const defaultRoundCreate = {
		startDate: new Date(),
		endDate: new Date(),
		number: 0
	};

	const defaultTeamPointsToValidate = {
		home_id: '',
		away_id: '',
		points_1: 0,
		points_2: 0,
		points_3: 0,
		points_4: 0,
		points_5: 0,
		points_6: 0,
		points_7: 0,
		points_8: 0,
		points_9: 0,
		points_10: 0,
		points_11: 0,
		points_12: 0,
		points_13: 0,
		points_14: 0,
		points_15: 0,
		points_16: 0,
		heats_1: 0,
		heats_2: 0,
		heats_3: 0,
		heats_4: 0,
		heats_5: 0,
		heats_6: 0,
		heats_7: 0,
		heats_8: 0,
		heats_9: 0,
		heats_10: 0,
		heats_11: 0,
		heats_12: 0,
		heats_13: 0,
		heats_14: 0,
		heats_15: 0,
		heats_16: 0
	};

	const [roundCreate, setRoundCreate] = useState<IRoundCreate>(
		defaultRoundCreate
	);
	const [rounds, setRounds] = useState([]);
	const [clubs, setClubs] = useState([]);
	const [riders, setRiders] = useState([]);
	const [dataToValidation, setDataToValidation] = useState<
		ITeamPointsToValidate
	>(defaultTeamPointsToValidate);
	const [matchDate, setMatchDate] = useState<Date>(new Date());
	const [wasRidden, setWasRidden] = useState<boolean>(false);

	const handleOnChangeCheckbox = event => {
		event.persist();
		if (event.target) {
			setWasRidden(event.target.checked);
		}
	};

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
						firstName: rider.firstName,
						lastName: rider.lastName,
						nickname: rider.nickname,
						dateOfBirth: rider.dateOfBirth,
						isForeigner: rider.isForeigner,
						ksm: rider.KSM,
						clubId: rider.clubId
					})
				);
			});
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
					'Nie udało się pobrać zawodników z bazy',
					'danger',
					3000
				);
			}
			throw new Error('Error in getting riders');
		}
	};

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
			setClubs([]);
			data.map(club => {
				setClubs(clubs =>
					clubs.concat({
						id: club._id,
						name: club.name
					})
				);
			});
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
	};

	const defaultValidatedPoints = {
		home_id: {
			message: '',
			error: false
		},
		away_id: {
			message: '',
			error: false
		},
		points_1: {
			message: '',
			error: false
		},
		points_2: {
			message: '',
			error: false
		},
		points_3: {
			message: '',
			error: false
		},
		points_4: {
			message: '',
			error: false
		},
		points_5: {
			message: '',
			error: false
		},
		points_6: {
			message: '',
			error: false
		},
		points_7: {
			message: '',
			error: false
		},
		points_8: {
			message: '',
			error: false
		},
		points_9: {
			message: '',
			error: false
		},
		points_10: {
			message: '',
			error: false
		},
		points_11: {
			message: '',
			error: false
		},
		points_12: {
			message: '',
			error: false
		},
		points_13: {
			message: '',
			error: false
		},
		points_14: {
			message: '',
			error: false
		},
		points_15: {
			message: '',
			error: false
		},
		points_16: {
			message: '',
			error: false
		},
		heats_1: {
			message: '',
			error: false
		},
		heats_2: {
			message: '',
			error: false
		},
		heats_3: {
			message: '',
			error: false
		},
		heats_4: {
			message: '',
			error: false
		},
		heats_5: {
			message: '',
			error: false
		},
		heats_6: {
			message: '',
			error: false
		},
		heats_7: {
			message: '',
			error: false
		},
		heats_8: {
			message: '',
			error: false
		},
		heats_9: {
			message: '',
			error: false
		},
		heats_10: {
			message: '',
			error: false
		},
		heats_11: {
			message: '',
			error: false
		},
		heats_12: {
			message: '',
			error: false
		},
		heats_13: {
			message: '',
			error: false
		},
		heats_14: {
			message: '',
			error: false
		},
		heats_15: {
			message: '',
			error: false
		},
		heats_16: {
			message: '',
			error: false
		}
	};

	const defaultValidatedRound = {
		number: {
			message: '',
			error: false
		},
		startDate: {
			message: '',
			error: false
		},
		endDate: {
			message: '',
			error: false
		}
	};

	const [validatedRound, setValidatedRound] = useState<IValidatedRound>(
		defaultValidatedRound
	);

	const [validatedPoints, setValidatedPoints] = useState<IValidatedPoints>(
		defaultValidatedPoints
	);

	const [home, setHome] = useState<ITeamPoints>({
		team_id: '',
		rider_1: defaultRiderPoints,
		rider_2: defaultRiderPoints,
		rider_3: defaultRiderPoints,
		rider_4: defaultRiderPoints,
		rider_5: defaultRiderPoints,
		rider_6: defaultRiderPoints,
		rider_7: defaultRiderPoints,
		rider_8: defaultRiderPoints
	});

	const [away, setAway] = useState<ITeamPoints>({
		team_id: '',
		rider_1: defaultRiderPoints,
		rider_2: defaultRiderPoints,
		rider_3: defaultRiderPoints,
		rider_4: defaultRiderPoints,
		rider_5: defaultRiderPoints,
		rider_6: defaultRiderPoints,
		rider_7: defaultRiderPoints,
		rider_8: defaultRiderPoints
	});

	const [addRoundDialogOpen, setAddRoundDialogOpen] = useState<boolean>(
		false
	);

	const handleOpen = () => {
		setAddRoundDialogOpen(true);
	};

	const handleClose = () => {
		setAddRoundDialogOpen(false);
		setRoundCreate(defaultRoundCreate);
	};

	const [number, setNumber] = useState<string>('');

	const handleOnChangeSelectClub = (homeAway: string) => event => {
		event.persist();
		if (event.target) {
			if (homeAway === 'home') {
				setHome((prevState: ITeamPoints) => ({
					...prevState,
					team_id: event.target.value
				}));
				setDataToValidation((prevState: ITeamPointsToValidate) => ({
					...prevState,
					home_id: event.target.value
				}));
			} else {
				setAway((prevState: ITeamPoints) => ({
					...prevState,
					team_id: event.target.value
				}));
				setDataToValidation((prevState: ITeamPointsToValidate) => ({
					...prevState,
					away_id: event.target.value
				}));
			}
		}
	};

	const handleOnChangeSelectRider = (
		number: string,
		homeAway: string
	) => event => {
		event.persist();
		const rider = parseInt(number.slice(-1));
		if (event.target) {
			if (homeAway === 'home') {
				switch (rider) {
					case 1:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: home.rider_1.points,
								heats: home.rider_1.heats
							}
						}));
						break;
					case 2:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: home.rider_2.points,
								heats: home.rider_2.heats
							}
						}));
						break;
					case 3:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: home.rider_3.points,
								heats: home.rider_3.heats
							}
						}));
						break;
					case 4:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: home.rider_4.points,
								heats: home.rider_4.heats
							}
						}));
						break;
					case 5:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: home.rider_5.points,
								heats: home.rider_5.heats
							}
						}));
						break;
					case 6:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: home.rider_6.points,
								heats: home.rider_6.heats
							}
						}));
						break;
					case 7:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: home.rider_7.points,
								heats: home.rider_7.heats
							}
						}));
						break;
					case 8:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: home.rider_8.points,
								heats: home.rider_8.heats
							}
						}));
						break;
					default:
						break;
				}
			} else {
				switch (rider) {
					case 1:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: away.rider_1.points,
								heats: away.rider_1.heats
							}
						}));
						break;
					case 2:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: away.rider_2.points,
								heats: away.rider_2.heats
							}
						}));
						break;
					case 3:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: away.rider_3.points,
								heats: away.rider_3.heats
							}
						}));
						break;
					case 4:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: away.rider_4.points,
								heats: away.rider_4.heats
							}
						}));
						break;
					case 5:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: away.rider_5.points,
								heats: away.rider_5.heats
							}
						}));
						break;
					case 6:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: away.rider_6.points,
								heats: away.rider_6.heats
							}
						}));
						break;
					case 7:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: away.rider_7.points,
								heats: away.rider_7.heats
							}
						}));
						break;
					case 8:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[number]: {
								_id: event.target.value,
								points: away.rider_8.points,
								heats: away.rider_8.heats
							}
						}));
						break;
					default:
						break;
				}
			}
		}
	};

	const handleOnChangeSelectRound = () => event => {
		event.persist();
		if (event.target) {
			if (event.target.value == 'New') {
				handleOpen();
			} else {
				setNumber(event.target.value);
			}
		}
	};

	const handleOnChangePoints = (rider: string, homeAway: string) => (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		const number = parseInt(rider.slice(-1));
		if (event.target) {
			if (homeAway === 'home') {
				switch (number) {
					case 1:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_1._id,
								points: parseInt(event.target.value),
								heats: home.rider_1.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_9: parseInt(event.target.value),
								heats_9: dataToValidation.heats_9
							})
						);
						break;
					case 2:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_2._id,
								points: parseInt(event.target.value),
								heats: home.rider_2.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_10: parseInt(event.target.value),
								heats_10: dataToValidation.heats_10
							})
						);
						break;
					case 3:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_3._id,
								points: parseInt(event.target.value),
								heats: home.rider_3.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_11: parseInt(event.target.value),
								heats_11: dataToValidation.heats_11
							})
						);
						break;
					case 4:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_4._id,
								points: parseInt(event.target.value),
								heats: home.rider_4.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_12: parseInt(event.target.value),
								heats_12: dataToValidation.heats_12
							})
						);
						break;
					case 5:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_5._id,
								points: parseInt(event.target.value),
								heats: home.rider_5.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_13: parseInt(event.target.value),
								heats_13: dataToValidation.heats_13
							})
						);
						break;
					case 6:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_6._id,
								points: parseInt(event.target.value),
								heats: home.rider_6.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_14: parseInt(event.target.value),
								heats_14: dataToValidation.heats_14
							})
						);
						break;
					case 7:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_7._id,
								points: parseInt(event.target.value),
								heats: home.rider_7.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_15: parseInt(event.target.value),
								heats_15: dataToValidation.heats_15
							})
						);
						break;
					case 8:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_8._id,
								points: parseInt(event.target.value),
								heats: home.rider_8.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_16: parseInt(event.target.value),
								heats_16: dataToValidation.heats_16
							})
						);
						break;
					default:
						break;
				}
			} else {
				switch (number) {
					case 1:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_1._id,
								points: parseInt(event.target.value),
								heats: away.rider_1.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_1: parseInt(event.target.value),
								heats_1: dataToValidation.heats_1
							})
						);
						break;
					case 2:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_2._id,
								points: parseInt(event.target.value),
								heats: away.rider_2.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_2: parseInt(event.target.value),
								heats_2: dataToValidation.heats_2
							})
						);
						break;
					case 3:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_3._id,
								points: parseInt(event.target.value),
								heats: away.rider_3.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_3: parseInt(event.target.value),
								heats_3: dataToValidation.heats_3
							})
						);
						break;
					case 4:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_4._id,
								points: parseInt(event.target.value),
								heats: away.rider_4.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_4: parseInt(event.target.value),
								heats_4: dataToValidation.heats_4
							})
						);
						break;
					case 5:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_5._id,
								points: parseInt(event.target.value),
								heats: away.rider_5.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_5: parseInt(event.target.value),
								heats_5: dataToValidation.heats_5
							})
						);
						break;
					case 6:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_6._id,
								points: parseInt(event.target.value),
								heats: away.rider_6.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_6: parseInt(event.target.value),
								heats_6: dataToValidation.heats_6
							})
						);
						break;
					case 7:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_7._id,
								points: parseInt(event.target.value),
								heats: away.rider_7.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_7: parseInt(event.target.value),
								heats_7: dataToValidation.heats_7
							})
						);
						break;
					case 8:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_8._id,
								points: parseInt(event.target.value),
								heats: away.rider_8.heats
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_8: parseInt(event.target.value),
								heats_8: dataToValidation.heats_8
							})
						);
						break;
					default:
						break;
				}
			}
		}
	};

	const handleOnChangeHeats = (rider: string, homeAway: string) => (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		const number = parseInt(rider.slice(-1));
		if (event.target) {
			if (homeAway === 'home') {
				switch (number) {
					case 1:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_1._id,
								points: home.rider_1.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_9: dataToValidation.points_9,
								heats_9: parseInt(event.target.value)
							})
						);
						break;
					case 2:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_2._id,
								points: home.rider_2.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_10: dataToValidation.points_10,
								heats_10: parseInt(event.target.value)
							})
						);
						break;
					case 3:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_3._id,
								points: home.rider_3.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_11: dataToValidation.points_11,
								heats_11: parseInt(event.target.value)
							})
						);
						break;
					case 4:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_4._id,
								points: home.rider_4.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_12: dataToValidation.points_12,
								heats_12: parseInt(event.target.value)
							})
						);
						break;
					case 5:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_5._id,
								points: home.rider_5.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_13: dataToValidation.points_13,
								heats_13: parseInt(event.target.value)
							})
						);
						break;
					case 6:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_6._id,
								points: home.rider_6.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_14: dataToValidation.points_14,
								heats_14: parseInt(event.target.value)
							})
						);
						break;
					case 7:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_7._id,
								points: home.rider_7.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_15: dataToValidation.points_15,
								heats_15: parseInt(event.target.value)
							})
						);
						break;
					case 8:
						setHome((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: home.rider_8._id,
								points: home.rider_8.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_16: dataToValidation.points_16,
								heats_16: parseInt(event.target.value)
							})
						);
						break;
					default:
						break;
				}
			} else {
				switch (number) {
					case 1:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_1._id,
								points: away.rider_1.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_1: dataToValidation.points_1,
								heats_1: parseInt(event.target.value)
							})
						);
						break;
					case 2:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_2._id,
								points: away.rider_2.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_2: dataToValidation.points_2,
								heats_2: parseInt(event.target.value)
							})
						);
						break;
					case 3:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_3._id,
								points: away.rider_3.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_3: dataToValidation.points_3,
								heats_3: parseInt(event.target.value)
							})
						);
						break;
					case 4:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_4._id,
								points: away.rider_4.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_4: dataToValidation.points_4,
								heats_4: parseInt(event.target.value)
							})
						);
						break;
					case 5:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_5._id,
								points: away.rider_5.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_5: dataToValidation.points_5,
								heats_5: parseInt(event.target.value)
							})
						);
						break;
					case 6:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_6._id,
								points: away.rider_6.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_6: dataToValidation.points_6,
								heats_6: parseInt(event.target.value)
							})
						);
						break;
					case 7:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_7._id,
								points: away.rider_7.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_7: dataToValidation.points_7,
								heats_7: parseInt(event.target.value)
							})
						);
						break;
					case 8:
						setAway((prevState: ITeamPoints) => ({
							...prevState,
							[rider]: {
								_id: away.rider_8._id,
								points: away.rider_8.points,
								heats: parseInt(event.target.value)
							}
						}));
						setDataToValidation(
							(prevState: ITeamPointsToValidate) => ({
								...prevState,
								points_8: dataToValidation.points_8,
								heats_8: parseInt(event.target.value)
							})
						);
						break;
					default:
						break;
				}
			}
		}
	};

	const handleOnChangeRoundForm = () => (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		if (event.target) {
			if (event.target.value === '') {
				setRoundCreate((prevState: IRoundCreate) => ({
					...prevState,
					number: 0
				}));
			} else {
				setRoundCreate((prevState: IRoundCreate) => ({
					...prevState,
					number: parseInt(event.target.value)
				}));
			}
		}
	};

	const handleDateBeginOnChange = date => {
		setRoundCreate((prevState: IRoundCreate) => ({
			...prevState,
			startDate: date
		}));
	};

	const handleDateEndOnChange = date => {
		setRoundCreate((prevState: IRoundCreate) => ({
			...prevState,
			endDate: date
		}));
	};

	const handleMatchDateOnChange = date => {
		setMatchDate(date);
	};

	const handleOnSubmitRound = (event: React.FormEvent) => {
		event.preventDefault();
		const validationResponse = validateRoundData(roundCreate);
		if (validationResponse.error) {
			setValidatedRound(() => defaultValidatedRound);
			validationResponse.error.details.forEach(
				(errorItem: ValidationErrorItem): any => {
					console.log(errorItem.message);
					setValidatedRound((prevState: IValidatedRound) => {
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
			addNewRound();
			setTimeout(() => {
				handleClose();
			}, 2000);
		}
	};

	const generateRounds = () => {
		return rounds.map((round, index) => {
			return (
				<MenuItem key={index} value={round._id}>
					Runda {round.number}
				</MenuItem>
			);
		});
	};

	const addNewRound = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.post(
				'https://fantasy-league-eti.herokuapp.com/rounds',
				roundCreate,
				options
			);
			addNotification(
				'Sukces',
				'Poprawnie dodano rundę',
				'success',
				2000
			);
			setTimeout(() => {
				window.location.reload(false);
			}, 2000);
			setRoundCreate(defaultRoundCreate);
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
					'Nie udało się dodać rundy z bazy',
					'danger',
					3000
				);
			}
			throw new Error('Error in adding rounds');
		}
	};

	const getRounds = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/rounds',
				options
			);
			setRounds([]);
			setRounds(data);
		} catch (e) {
			if (e.response.statusText == 'Unauthorized') {
				addNotification('Błąd', 'Sesja wygasła', 'danger', 3000);
				setTimeout(() => {
					push('/login');
				}, 3000);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się pobrać rund z bazy',
					'danger',
					3000
				);
			}
			throw new Error('Error in getting rounds');
		}
	};

	const selectClubs = homeAway => {
		if (homeAway === 'home') {
			return clubs
				.filter(filtered => filtered.id !== away.team_id)
				.map((club, index) => {
					return (
						<MenuItem key={index} value={club.id}>
							{club.name}
						</MenuItem>
					);
				});
		} else {
			return clubs
				.filter(filtered => filtered.id !== home.team_id)
				.map((club, index) => {
					return (
						<MenuItem key={index} value={club.id}>
							{club.name}
						</MenuItem>
					);
				});
		}
	};

	const isU21 = date => {
		if (new Date().getFullYear() - new Date(date).getFullYear() < 22) {
			return true;
		} else {
			return false;
		}
	};

	const isU23 = date => {
		if (new Date().getFullYear() - new Date(date).getFullYear() < 24) {
			return true;
		} else {
			return false;
		}
	};

	const selectRiders = (clubId, number) => {
		if (number === 8) {
			return riders
				.filter(
					filtered =>
						filtered.clubId === clubId &&
						isU23(
							filtered.dateOfBirth
						)
				)
				.map((rider, index) => {
					return (
						<MenuItem key={index} value={rider.id}>
							{rider.firstName} {rider.lastName}
						</MenuItem>
					);
				});
		} else if (number === 6 || number === 7) {
			return riders
				.filter(
					filtered =>
						filtered.clubId === clubId &&
						isU21(filtered.dateOfBirth) &&
						!filtered.isForeigner
				)
				.map((rider, index) => {
					return (
						<MenuItem key={index} value={rider.id}>
							{rider.firstName} {rider.lastName}
						</MenuItem>
					);
				});
		} else {
			return riders
				.filter(
					filtered =>
						filtered.clubId ==
						clubId
				)
				.map((rider, index) => {
					return (
						<MenuItem key={index} value={rider.id}>
							{rider.firstName} {rider.lastName}
						</MenuItem>
					);
				});
		}
	};

	const selectRidersFields = () => {
		if (wasRidden) {
			return (
				<>
					<div className="add-match__away-div">
						AWAY
						<br />
						<Select
							className="add-match__team-select"
							value={away.team_id || ''}
							onChange={handleOnChangeSelectClub('away')}
						>
							{selectClubs('away')}
						</Select>
						<br />
						<div className="add-match__rider-div">
							<div className="add-match__rider-select-title">
								ZAWODNIK
							</div>
							<div className="add-match__rider-points-title">
								PUNKTY
							</div>
							<div className="add-match__rider-heats-title">
								BIEGI
							</div>
						</div>
						<div className="add-match__rider-div">
							1.
							<Select
								className="add-match__rider-select"
								value={away.rider_1._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_1',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.team_id, 1)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={away.rider_1.points || ''}
								onChange={handleOnChangePoints(
									'rider_1',
									'away'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={away.rider_1.heats || ''}
								onChange={handleOnChangeHeats('rider_1', 'away')}
							/>
						</div>
						<div className="add-match__rider-div">
							2.
							<Select
								className="add-match__rider-select"
								value={away.rider_2._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_2',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.team_id, 2)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={away.rider_2.points || ''}
								onChange={handleOnChangePoints(
									'rider_2',
									'away'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={away.rider_2.heats || ''}
								onChange={handleOnChangeHeats('rider_2', 'away')}
							/>
						</div>
						<div className="add-match__rider-div">
							3.
							<Select
								className="add-match__rider-select"
								value={away.rider_3._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_3',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.team_id, 3)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={away.rider_3.points || ''}
								onChange={handleOnChangePoints(
									'rider_3',
									'away'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={away.rider_3.heats || ''}
								onChange={handleOnChangeHeats('rider_3', 'away')}
							/>
						</div>
						<div className="add-match__rider-div">
							4.
							<Select
								className="add-match__rider-select"
								value={away.rider_4._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_4',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.team_id, 4)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={away.rider_4.points || ''}
								onChange={handleOnChangePoints(
									'rider_4',
									'away'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={away.rider_4.heats || ''}
								onChange={handleOnChangeHeats('rider_4', 'away')}
							/>
						</div>
						<div className="add-match__rider-div">
							5.
							<Select
								className="add-match__rider-select"
								value={away.rider_5._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_5',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.team_id, 5)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={away.rider_5.points || ''}
								onChange={handleOnChangePoints(
									'rider_5',
									'away'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={away.rider_5.heats || ''}
								onChange={handleOnChangeHeats('rider_5', 'away')}
							/>
						</div>
						<div className="add-match__rider-div">
							6.
							<Select
								className="add-match__rider-select"
								value={away.rider_6._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_6',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.team_id, 6)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={away.rider_6.points || ''}
								onChange={handleOnChangePoints(
									'rider_6',
									'away'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={away.rider_6.heats || ''}
								onChange={handleOnChangeHeats('rider_6', 'away')}
							/>
						</div>
						<div className="add-match__rider-div">
							7.
							<Select
								className="add-match__rider-select"
								value={away.rider_7._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_7',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.team_id, 7)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={away.rider_7.points || ''}
								onChange={handleOnChangePoints(
									'rider_7',
									'away'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={away.rider_7.heats || ''}
								onChange={handleOnChangeHeats('rider_7', 'away')}
							/>
						</div>
						<div className="add-match__rider-div">
							8.
							<Select
								className="add-match__rider-select"
								value={away.rider_8._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_8',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.team_id, 8)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={away.rider_8.points || ''}
								onChange={handleOnChangePoints(
									'rider_8',
									'away'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={away.rider_8.heats || ''}
								onChange={handleOnChangeHeats('rider_8', 'away')}
							/>
						</div>
					</div>
					<div className="add-match__home-div">
						HOME
						<br />
						<Select
							className="add-match__team-select"
							value={home.team_id}
							onChange={handleOnChangeSelectClub('home')}
						>
							{selectClubs('home')}
						</Select>
						<br />
						<div className="add-match__rider-div">
							<div className="add-match__rider-select-title">
								ZAWODNIK
							</div>
							<div className="add-match__rider-points-title">
								PUNKTY
							</div>
							<div className="add-match__rider-heats-title">
								BIEGI
							</div>
						</div>
						<div className="add-match__rider-div">
							9.
							<Select
								className="add-match__rider-select"
								value={home.rider_1._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_1',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.team_id, 1)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={home.rider_1.points || ''}
								onChange={handleOnChangePoints(
									'rider_1',
									'home'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={home.rider_1.heats || ''}
								onChange={handleOnChangeHeats('rider_1', 'home')}
							/>
						</div>
						<div className="add-match__rider-div">
							10.
							<Select
								className="add-match__rider-select"
								value={home.rider_2._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_2',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.team_id, 2)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={home.rider_2.points || ''}
								onChange={handleOnChangePoints(
									'rider_2',
									'home'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={home.rider_2.heats || ''}
								onChange={handleOnChangeHeats('rider_2', 'home')}
							/>
						</div>
						<div className="add-match__rider-div">
							11.
							<Select
								className="add-match__rider-select"
								value={home.rider_3._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_3',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.team_id, 3)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={home.rider_3.points || ''}
								onChange={handleOnChangePoints(
									'rider_3',
									'home'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={home.rider_3.heats || ''}
								onChange={handleOnChangeHeats('rider_3', 'home')}
							/>
						</div>
						<div className="add-match__rider-div">
							12.
							<Select
								className="add-match__rider-select"
								value={home.rider_4._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_4',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.team_id, 4)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={home.rider_4.points || ''}
								onChange={handleOnChangePoints(
									'rider_4',
									'home'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={home.rider_4.heats || ''}
								onChange={handleOnChangeHeats('rider_4', 'home')}
							/>
						</div>
						<div className="add-match__rider-div">
							13.
							<Select
								className="add-match__rider-select"
								value={home.rider_5._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_5',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.team_id, 5)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={home.rider_5.points || ''}
								onChange={handleOnChangePoints(
									'rider_5',
									'home'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={home.rider_5.heats || ''}
								onChange={handleOnChangeHeats('rider_5', 'home')}
							/>
						</div>
						<div className="add-match__rider-div">
							14.
							<Select
								className="add-match__rider-select"
								value={home.rider_6._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_6',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.team_id, 6)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={home.rider_6.points || ''}
								onChange={handleOnChangePoints(
									'rider_6',
									'home'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={home.rider_6.heats || ''}
								onChange={handleOnChangeHeats('rider_6', 'home')}
							/>
						</div>
						<div className="add-match__rider-div">
							15.
							<Select
								className="add-match__rider-select"
								value={home.rider_7._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_7',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.team_id, 7)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={home.rider_7.points || ''}
								onChange={handleOnChangePoints(
									'rider_7',
									'home'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={home.rider_7.heats || ''}
								onChange={handleOnChangeHeats('rider_7', 'home')}
							/>
						</div>
						<div className="add-match__rider-div">
							16.
							<Select
								className="add-match__rider-select"
								value={home.rider_8._id || ''}
								onChange={handleOnChangeSelectRider(
									'rider_8',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.team_id, 8)}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={home.rider_8.points || ''}
								onChange={handleOnChangePoints(
									'rider_8',
									'home'
								)}
							/>
							<TextField 
								className="add-match__rider-heats"
								value={home.rider_8.heats || ''}
								onChange={handleOnChangeHeats('rider_8', 'home')}
							/>
						</div>
					</div>
					<br />
				</>
			);
		} else {
			return (
				<>
					<div className="add-match__away-div">
						AWAY
						<br />
						<Select
							className="add-match__team-select"
							value={away.team_id || ''}
							onChange={handleOnChangeSelectClub('away')}
						>
							{selectClubs('away')}
						</Select>
						<br />
					</div>
					<div className="add-match__home-div">
						HOME
						<br />
						<Select
							className="add-match__team-select"
							value={home.team_id}
							onChange={handleOnChangeSelectClub('home')}
						>
							{selectClubs('home')}
						</Select>
						<br />
					</div>
				</>
			);
		}
	};

	const addMatch = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.post(
				'https://fantasy-league-eti.herokuapp.com/matches',
				{
					roundId: number,
					homeId: home.team_id,
					awayId: away.team_id,
					date: matchDate,
					wasRidden: wasRidden
				},
				options
			);
			if (wasRidden) {
				addRiderToMatch(
					away.rider_1._id,
					data._id,
					away.rider_1.points,
					1
				);
				addRiderToMatch(
					away.rider_2._id,
					data._id,
					away.rider_2.points,
					2
				);
				addRiderToMatch(
					away.rider_3._id,
					data._id,
					away.rider_3.points,
					3
				);
				addRiderToMatch(
					away.rider_4._id,
					data._id,
					away.rider_4.points,
					4
				);
				addRiderToMatch(
					away.rider_5._id,
					data._id,
					away.rider_5.points,
					5
				);
				addRiderToMatch(
					away.rider_6._id,
					data._id,
					away.rider_6.points,
					6
				);
				addRiderToMatch(
					away.rider_7._id,
					data._id,
					away.rider_7.points,
					7
				);
				addRiderToMatch(
					away.rider_8._id,
					data._id,
					away.rider_8.points,
					8
				);
				addRiderToMatch(
					home.rider_1._id,
					data._id,
					home.rider_1.points,
					9
				);
				addRiderToMatch(
					home.rider_2._id,
					data._id,
					home.rider_2.points,
					10
				);
				addRiderToMatch(
					home.rider_3._id,
					data._id,
					home.rider_3.points,
					11
				);
				addRiderToMatch(
					home.rider_4._id,
					data._id,
					home.rider_4.points,
					12
				);
				addRiderToMatch(
					home.rider_5._id,
					data._id,
					home.rider_5.points,
					13
				);
				addRiderToMatch(
					home.rider_6._id,
					data._id,
					home.rider_6.points,
					14
				);
				addRiderToMatch(
					home.rider_7._id,
					data._id,
					home.rider_7.points,
					15
				);
				addRiderToMatch(
					home.rider_8._id,
					data._id,
					home.rider_8.points,
					16
				);
			}
			addNotification('Sukces', 'Poprawnie dodano mecz', 'success', 1000);
			setTimeout(() => {
				{
					window.location.reload(false);
				}
			}, 1000);
		} catch (e) {
			if (e.statusText == 'Bad Request') {
				addNotification(
					'Błąd!',
					'Podany mecz już istnieje w bazie!',
					'danger',
					1000
				);
			} else if (e.statusText == 'Unauthorized') {
				addNotification('Błąd!', 'Twoja sesja wygasła', 'danger', 1000);
				setTimeout(() => {
					push('/login');
				}, 1000);
			} else {
				addNotification(
					'Błąd!',
					'Nie udało się dodać meczu!',
					'danger',
					1000
				);
			}
			throw new Error('Error in adding new match!');
		}
	};

	const addRiderToMatch = async (riderId, matchId, score, number) => {
		if (riderId !== '') {
			try {
				const accessToken = getToken();
				const options = {
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
				const { data } = await axios.post(
					`https://fantasy-league-eti.herokuapp.com/match/${matchId}/riders`,
					{
						riderId: riderId,
						score: score,
						riderNumber: number
					},
					options
				);
			} catch (e) {
				if (e.statusText == 'Bad Request') {
					addNotification(
						'Błąd!',
						'Podane punkty zawodnika już istnieją w bazie!',
						'danger',
						1000
					);
				} else if (e.statusText == 'Unauthorized') {
					addNotification(
						'Błąd!',
						'Twoja sesja wygasła',
						'danger',
						1000
					);
					setTimeout(() => {
						push('/login');
					}, 1000);
				} else {
					addNotification(
						'Błąd!',
						'Nie udało się dodać punktów zawodnika!',
						'danger',
						1000
					);
				}
				throw new Error('Error in adding new rider to match!');
			}
		}
	};

	const handleOnSubmit = () => {
		const validationResponse = validateMatchPointsData(dataToValidation);
		if (validationResponse.error) {
			setValidatedPoints(() => defaultValidatedPoints);
			validationResponse.error.details.forEach(
				(errorItem: ValidationErrorItem): any => {
					setValidatedPoints((prevState: IValidatedPoints) => {
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
			addMatch();
		}
	};

	useEffect(() => {

		(async function () {
			try {
				await getRiders();
				await getClubs();
				await getRounds();
				if (!userData.username)
					await fetchUserData(dispatchUserData, setLoggedIn, push);
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				} else {
					addNotification('Błąd!', 'Nie udało się pobrać danych z bazy', 'danger', 1500);
				}
			}
		})();
		setTimeout(() => {
			document.body.style.overflow = 'auto';
		}, 3000);
	}, []);

	return userData._id && checkAdminRole(userData.role) ? (
		<>
			<div className="add-match">
				<div className="add-match__background" />
				<Paper className="add-match__box">
					<Typography variant="h2" className="add-match__header">
						Dodaj nowy mecz
					</Typography>
					<Divider />
					<br />
					<div className="add-match__round-div">
						<InputLabel id="roundLabel">Kolejka:</InputLabel>
						<Select
							labelId="roundLabel"
							className="add-match__round-select"
							value={number || ''}
							onChange={handleOnChangeSelectRound()}
						>
							<MenuItem value="New">Dodaj nową kolejkę</MenuItem>
							{generateRounds()}
						</Select>
						<br />
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								margin="normal"
								id="date-picker-dialog-1"
								format="dd/MM/yyyy"
								value={matchDate}
								onChange={handleMatchDateOnChange}
								KeyboardButtonProps={{
									'aria-label': 'change date'
								}}
							/>
						</MuiPickersUtilsProvider>
						<br />
						<Typography variant="h5">
							Czy mecz został rozegrany?
						</Typography>
						<Checkbox
							onChange={handleOnChangeCheckbox}
							size="small"
							className="add-match__checkbox"
							title="Zaznacz jeśli mecz został rozegrany"
						/>
					</div>
					<Dialog
						open={addRoundDialogOpen}
						onClose={handleClose}
						className="number-dialog"
					>
						<DialogTitle>
							<div className="number-dialog__header">
								<Typography
									variant="h4"
									className="number-dialog__title"
								>
									Dodawanie kolejki
								</Typography>
								<IconButton
									onClick={handleClose}
									className="number-dialog__fix"
								>
									<FiX />
								</IconButton>
							</div>
						</DialogTitle>
						<DialogContent dividers>
							<form className="number-dialog__form">
								<Grid container>
									<Grid
										item
										xs={7}
										className="number-dialog__form-fields"
									>
										<FormControl className="number-dialog__form-field">
											<TextField
												label="Numer kolejki"
												required
												autoComplete="number"
												value={roundCreate.number.toString()}
												error={
													validatedRound.number.error
												}
												helperText={
													validatedRound.number
														.message
												}
												onChange={handleOnChangeRoundForm()}
											/>
										</FormControl>
										<br />
										<FormControl className="number-dialog__form-field-date">
											Data rozpoczęcia kolejki:
											<MuiPickersUtilsProvider
												utils={DateFnsUtils}
											>
												<KeyboardDatePicker
													margin="normal"
													id="date-picker-dialog-1"
													format="dd/MM/yyyy"
													value={
														roundCreate.startDate
													}
													onChange={
														handleDateBeginOnChange
													}
													KeyboardButtonProps={{
														'aria-label':
															'change date'
													}}
												/>
											</MuiPickersUtilsProvider>
										</FormControl>
										<br />
										<FormControl className="number-dialog__form-field-date">
											Data zakończenia kolejki:
											<MuiPickersUtilsProvider
												utils={DateFnsUtils}
											>
												<KeyboardDatePicker
													margin="normal"
													id="date-picker-dialog-2"
													format="dd/MM/yyyy"
													value={roundCreate.endDate}
													onChange={
														handleDateEndOnChange
													}
													KeyboardButtonProps={{
														'aria-label':
															'change date'
													}}
												/>
											</MuiPickersUtilsProvider>
										</FormControl>
									</Grid>
									<Grid item xs={12}>
										<Button
											className="btn dialog__form_button"
											onClick={handleOnSubmitRound}
										>
											Dodaj
										</Button>
									</Grid>
								</Grid>
							</form>
						</DialogContent>
					</Dialog>
					<br />
					{selectRidersFields()}
					<Button
						className="add-match__submit-button"
						onClick={handleOnSubmit}
					>
						Dodaj
					</Button>
				</Paper>
			</div>
		</>
	) : !userData._id ? (
		<div className="add-match">
			<div className="add-match__background" />
			<Paper className="add-match__box">
				<Grid container justify="center" alignItems="center">
					<CircularProgress />
				</Grid>
			</Paper>
		</div>
	) : (
		<Redirect to="/druzyna" />
	);
};

export default AddMatch;
