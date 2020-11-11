import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import getToken from '../utils/getToken';
import addNotification from '../utils/addNotification';
import { useHistory } from 'react-router-dom';
import {
	Divider,
	Typography,
	Button,
	Dialog,
	MenuItem,
	Select,
	TextField,
	Checkbox,
	Grid
} from '@material-ui/core';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import checkAdminRole from '../utils/checkAdminRole';
import { useStateValue } from './AppProvider';
import { checkBadAuthorization, checkCookies } from '../utils/checkCookies';

interface IProps {
	matchId: string;
	homeId: string;
	awayId: string;
	homeScore: number;
	awayScore: number;
	riders: Array<IRider1>;
	date: Date;
	wasRidden: boolean;
}

interface IRider {
	matchRiderId: string;
	riderId: string;
	firstName: string;
	lastName: string;
	score: number;
	riderNumber: number;
	heats: number;
}

interface IRider1 {
	_id: string;
	firstName: string;
	lastName: string;
	nickname: string;
	dateOfBirth: Date;
	isForeigner: boolean;
	ksm: number;
	clubId: string;
}

interface IRiders {
	rider_1: IRider;
	rider_2: IRider;
	rider_3: IRider;
	rider_4: IRider;
	rider_5: IRider;
	rider_6: IRider;
	rider_7: IRider;
	rider_8: IRider;
	rider_9: IRider;
	rider_10: IRider;
	rider_11: IRider;
	rider_12: IRider;
	rider_13: IRider;
	rider_14: IRider;
	rider_15: IRider;
	rider_16: IRider;
}

interface IClub {
	clubId: string;
	name: string;
	logoUrl: string;
}

interface IRidersEdit {
	rider_1: IRiderEdit;
	rider_2: IRiderEdit;
	rider_3: IRiderEdit;
	rider_4: IRiderEdit;
	rider_5: IRiderEdit;
	rider_6: IRiderEdit;
	rider_7: IRiderEdit;
	rider_8: IRiderEdit;
	rider_9: IRiderEdit;
	rider_10: IRiderEdit;
	rider_11: IRiderEdit;
	rider_12: IRiderEdit;
	rider_13: IRiderEdit;
	rider_14: IRiderEdit;
	rider_15: IRiderEdit;
	rider_16: IRiderEdit;
}

interface IRiderEdit {
	riderId: string;
	points: number;
	heats: number;
}

const defaultRiderData = {
	matchRiderId: '',
	riderId: '',
	firstName: '',
	lastName: '',
	score: 0,
	riderNumber: 0,
	heats: 0
};

const defaultRidersData = {
	rider_1: defaultRiderData,
	rider_2: defaultRiderData,
	rider_3: defaultRiderData,
	rider_4: defaultRiderData,
	rider_5: defaultRiderData,
	rider_6: defaultRiderData,
	rider_7: defaultRiderData,
	rider_8: defaultRiderData,
	rider_9: defaultRiderData,
	rider_10: defaultRiderData,
	rider_11: defaultRiderData,
	rider_12: defaultRiderData,
	rider_13: defaultRiderData,
	rider_14: defaultRiderData,
	rider_15: defaultRiderData,
	rider_16: defaultRiderData
};

const defaultRiderEditData = {
	riderId: '',
	points: 0,
	heats: 0
};

const defaultRidersEditData = {
	rider_1: defaultRiderEditData,
	rider_2: defaultRiderEditData,
	rider_3: defaultRiderEditData,
	rider_4: defaultRiderEditData,
	rider_5: defaultRiderEditData,
	rider_6: defaultRiderEditData,
	rider_7: defaultRiderEditData,
	rider_8: defaultRiderEditData,
	rider_9: defaultRiderEditData,
	rider_10: defaultRiderEditData,
	rider_11: defaultRiderEditData,
	rider_12: defaultRiderEditData,
	rider_13: defaultRiderEditData,
	rider_14: defaultRiderEditData,
	rider_15: defaultRiderEditData,
	rider_16: defaultRiderEditData
};

const ListMatchesMatch: FunctionComponent<IProps> = ({
	matchId,
	homeId,
	awayId,
	homeScore,
	awayScore,
	riders,
	date,
	wasRidden
}) => {
	const [home, setHome] = useState<IClub>();
	const [away, setAway] = useState<IClub>();
	const [matchRiders, setMatchRiders] = useState<IRiders>(defaultRidersData);
	const { push } = useHistory();
	const [openScores, setOpenScores] = useState<boolean>(false);
	const [openEdit, setOpenEdit] = useState<boolean>(false);
	const [wasRiddenEdit, setWasRiddenEdit] = useState<boolean>(wasRidden);
	const [matchRidersEdit, setMatchRidersEdit] = useState<IRidersEdit>(
		defaultRidersEditData
	);
	const [matchDateEdit, setMatchDateEdit] = useState<Date>(new Date(date));
	const { userData, setLoggedIn } = useStateValue();
	const [loading, setLoading] = useState<boolean>(true);
	const [isHidden, setIsHidden] = useState<boolean>(false);
	const [homeScoreEdit, setHomeScoreEdit] = useState(homeScore);
	const [awayScoreEdit, setAwayScoreEdit] = useState(awayScore);
	const isAdmin = checkAdminRole(userData.role) && checkCookies();

	const getClub = async (clubId: string, homeAway: string) => {
		if (homeAway === 'home') {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/clubs/${clubId}`,
				options
			);
			setHome({
				clubId: data._id,
				name: data.name,
				logoUrl: data.logoUrl
			});
		} else {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/clubs/${clubId}`,
				options
			);
			setAway({
				clubId: data._id,
				name: data.name,
				logoUrl: data.logoUrl
			});
		}
	};

	const handleOpenScores = () => {
		if (wasRiddenEdit) {
			getMatchRiders();
			setOpenScores(true);
		}
	};

	const handleCloseScores = () => {
		setOpenScores(false);
	};

	const setRidersEdit = () => {
		setMatchRidersEdit({
			rider_1: {
				points: matchRiders.rider_1.score,
				riderId: matchRiders.rider_1.riderId,
				heats: matchRiders.rider_1.heats
			},
			rider_2: {
				points: matchRiders.rider_2.score,
				riderId: matchRiders.rider_2.riderId,
				heats: matchRiders.rider_2.heats
			},
			rider_3: {
				points: matchRiders.rider_3.score,
				riderId: matchRiders.rider_3.riderId,
				heats: matchRiders.rider_3.heats
			},
			rider_4: {
				points: matchRiders.rider_4.score,
				riderId: matchRiders.rider_4.riderId,
				heats: matchRiders.rider_4.heats
			},
			rider_5: {
				points: matchRiders.rider_5.score,
				riderId: matchRiders.rider_5.riderId,
				heats: matchRiders.rider_5.heats
			},
			rider_6: {
				points: matchRiders.rider_6.score,
				riderId: matchRiders.rider_6.riderId,
				heats: matchRiders.rider_6.heats
			},
			rider_7: {
				points: matchRiders.rider_7.score,
				riderId: matchRiders.rider_7.riderId,
				heats: matchRiders.rider_7.heats
			},
			rider_8: {
				points: matchRiders.rider_8.score,
				riderId: matchRiders.rider_8.riderId,
				heats: matchRiders.rider_8.heats
			},
			rider_9: {
				points: matchRiders.rider_9.score,
				riderId: matchRiders.rider_9.riderId,
				heats: matchRiders.rider_9.heats
			},
			rider_10: {
				points: matchRiders.rider_10.score,
				riderId: matchRiders.rider_10.riderId,
				heats: matchRiders.rider_10.heats
			},
			rider_11: {
				points: matchRiders.rider_11.score,
				riderId: matchRiders.rider_11.riderId,
				heats: matchRiders.rider_11.heats
			},
			rider_12: {
				points: matchRiders.rider_12.score,
				riderId: matchRiders.rider_12.riderId,
				heats: matchRiders.rider_12.heats
			},
			rider_13: {
				points: matchRiders.rider_13.score,
				riderId: matchRiders.rider_13.riderId,
				heats: matchRiders.rider_13.heats
			},
			rider_14: {
				points: matchRiders.rider_14.score,
				riderId: matchRiders.rider_14.riderId,
				heats: matchRiders.rider_14.heats
			},
			rider_15: {
				points: matchRiders.rider_15.score,
				riderId: matchRiders.rider_15.riderId,
				heats: matchRiders.rider_15.heats
			},
			rider_16: {
				points: matchRiders.rider_16.score,
				riderId: matchRiders.rider_16.riderId,
				heats: matchRiders.rider_16.heats
			}
		});
	};

	const handleOpenEdit = () => {
		getMatchRiders();
		setOpenEdit(true);
	};

	const handleCloseEdit = () => {
		setOpenEdit(false);
	};

	const setMatchRider = (name, rider) => {
		setMatchRiders((prevState: IRiders) => ({
			...prevState,
			[name]: {
				matchRiderId: rider._id,
				riderId: rider.riderId,
				firstName: rider.rider.firstName,
				lastName: rider.rider.lastName,
				score: rider.score,
				riderNumber: rider.riderNumber,
				heats: rider.heats
			}
		}));
		setMatchRidersEdit((prevState: IRidersEdit) => ({
			...prevState,
			[name]: {
				riderId: rider.riderId,
				points: rider.score,
				heats: rider.heats
			}
		}));
	};

	const getMatchRiders = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/matches/${matchId}/riders`,
				options
			);
			data.map(rider => {
				switch (rider.riderNumber) {
					case 1:
						setMatchRider('rider_1', rider);
						break;
					case 2:
						setMatchRider('rider_2', rider);
						break;
					case 3:
						setMatchRider('rider_3', rider);
						break;
					case 4:
						setMatchRider('rider_4', rider);
						break;
					case 5:
						setMatchRider('rider_5', rider);
						break;
					case 6:
						setMatchRider('rider_6', rider);
						break;
					case 7:
						setMatchRider('rider_7', rider);
						break;
					case 8:
						setMatchRider('rider_8', rider);
						break;
					case 9:
						setMatchRider('rider_9', rider);
						break;
					case 10:
						setMatchRider('rider_10', rider);
						break;
					case 11:
						setMatchRider('rider_11', rider);
						break;
					case 12:
						setMatchRider('rider_12', rider);
						break;
					case 13:
						setMatchRider('rider_13', rider);
						break;
					case 14:
						setMatchRider('rider_14', rider);
						break;
					case 15:
						setMatchRider('rider_15', rider);
						break;
					case 16:
						setMatchRider('rider_16', rider);
						break;
					default:
						break;
				}
			});
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się pobrać zawodników z bazy',
					'danger',
					3000
				);
			}
		}
	};

	const generateScore = () => {
		if (wasRiddenEdit) {
			return (
				<Typography variant="h3">
					{homeScoreEdit}:{awayScoreEdit}
				</Typography>
			);
		} else {
			return (
				<Typography variant="h5">
					{new Date(matchDateEdit).toLocaleDateString()}
				</Typography>
			);
		}
	};

	const handleDeleteMatch = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			await axios.delete(
				`https://fantasy-league-eti.herokuapp.com/matches/${matchId}`,
				options
			);
			addNotification('Sukces', 'Udało się usunąć mecz', 'success', 1000);
			setIsHidden(true);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else if (data.statusCode == 404) {
				addNotification(
					'Błąd!',
					'Nie ma takiego meczu w bazie!',
					'danger',
					1000
				);
			} else {
				addNotification(
					'Błąd!',
					'Nie udało się usunąć meczu!',
					'danger',
					1000
				);
			}
		}
	};

	const generateMatchDiv = () => {
		if (home && away) {
			return (
				<>
					<div className="list-matches-match">
						<Grid container justify="center" alignItems="center">
							<Grid
								item
								xs={12}
								md={4}
								className="list-matches-match__club"
							>
								<img
									src={
										home.logoUrl
											? (home.logoUrl as string)
											: '/img/warsaw_venue.jpg'
									}
									alt="club-logo"
									className="list-matches-match__club-image"
								/>
								<Typography
									variant="h3"
									className="list-matches-match__clubName"
								>
									{home.name}
								</Typography>
							</Grid>
							<Grid item xs={12} md={4}>
								<Grid
									container
									direction="column"
									justify="center"
									alignItems="center"
								>
									<Grid
										item
										className="list-matches-match__options"
									>
										<Button
											className="list-matches-match__btn-space btn"
											onClick={handleOpenScores}
											disabled={!wasRidden}
										>
											Wyniki
										</Button>
										{isAdmin && (
											<>
												<Button
													className="list-matches-match__btn-space btn"
													onClick={handleOpenEdit}
												>
													Edytuj
												</Button>
												<Button
													className="btn"
													onClick={handleDeleteMatch}
												>
													Usuń
												</Button>
											</>
										)}
									</Grid>
									<Grid item>{generateScore()}</Grid>
								</Grid>
							</Grid>
							<Grid
								item
								xs={12}
								md={4}
								className="list-matches-match__club"
							>
								<img
									src={
										away.logoUrl
											? (away.logoUrl as string)
											: '/img/warsaw_venue.jpg'
									}
									alt="club-logo"
									className="list-matches-match__club-image"
								/>
								<Typography
									variant="h3"
									className="list-matches-match__clubName"
								>
									{away.name}
								</Typography>
							</Grid>
						</Grid>
					</div>
					<Divider />
					<br />
				</>
			);
		}
	};

	const generateRiderScoreDiv = (firstName, lastName, score, number) => {
		return (
			<>
				<div className="scores-dialog__rider-score-div">
					<div className="scores-dialog__rider">
						{number}. {firstName} {lastName}
					</div>
					<div className="scores-dialog__score">
						{score === 0 ? '' : score}
					</div>
				</div>
				<Divider />
			</>
		);
	};

	const generateScoresDialog = () => {
		return (
			<>
				<Dialog
					open={openScores}
					onClose={handleCloseScores}
					className="scores-dialog"
					fullWidth={true}
					maxWidth={'md'}
				>
					<div className="scores-dialog__div">
						<div className="scores-dialog__away">
							<Typography
								variant="h3"
								className="scores-dialog__club-name"
							>
								{away ? away.name : ''}
							</Typography>
							<img
								src={
									away
										? away.logoUrl
											? (away.logoUrl as string)
											: '/img/warsaw_venue.jpg'
										: '/img/warsaw_venue.jpg'
								}
								alt="club-logo"
								className="scores-dialog__club-image"
							/>
							<div className="scores-dialog__club-score">
								{awayScoreEdit}
							</div>
							{generateRiderScoreDiv(
								matchRiders.rider_1.firstName,
								matchRiders.rider_1.lastName,
								matchRiders.rider_1.score,
								1
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_2.firstName,
								matchRiders.rider_2.lastName,
								matchRiders.rider_2.score,
								2
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_3.firstName,
								matchRiders.rider_3.lastName,
								matchRiders.rider_3.score,
								3
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_4.firstName,
								matchRiders.rider_4.lastName,
								matchRiders.rider_4.score,
								4
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_5.firstName,
								matchRiders.rider_5.lastName,
								matchRiders.rider_5.score,
								5
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_6.firstName,
								matchRiders.rider_6.lastName,
								matchRiders.rider_6.score,
								6
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_7.firstName,
								matchRiders.rider_7.lastName,
								matchRiders.rider_7.score,
								7
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_8.firstName,
								matchRiders.rider_8.lastName,
								matchRiders.rider_8.score,
								8
							)}
						</div>
						<div className="scores-dialog__divider"></div>
						<div className="scores-dialog__home">
							<Typography
								variant="h3"
								className="scores-dialog__clubName"
							>
								{home ? home.name : ''}
							</Typography>
							<img
								src={
									home
										? home.logoUrl
											? (home.logoUrl as string)
											: '/img/warsaw_venue.jpg'
										: '/img/warsaw_venue.jpg'
								}
								alt="club-logo"
								className="scores-dialog__club-image"
							/>
							<div className="scores-dialog__club-score">
								{homeScoreEdit}
							</div>
							{generateRiderScoreDiv(
								matchRiders.rider_9.firstName,
								matchRiders.rider_9.lastName,
								matchRiders.rider_9.score,
								9
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_10.firstName,
								matchRiders.rider_10.lastName,
								matchRiders.rider_10.score,
								10
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_11.firstName,
								matchRiders.rider_11.lastName,
								matchRiders.rider_11.score,
								11
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_12.firstName,
								matchRiders.rider_12.lastName,
								matchRiders.rider_12.score,
								12
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_13.firstName,
								matchRiders.rider_13.lastName,
								matchRiders.rider_13.score,
								13
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_14.firstName,
								matchRiders.rider_14.lastName,
								matchRiders.rider_14.score,
								14
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_15.firstName,
								matchRiders.rider_15.lastName,
								matchRiders.rider_15.score,
								15
							)}
							{generateRiderScoreDiv(
								matchRiders.rider_16.firstName,
								matchRiders.rider_16.lastName,
								matchRiders.rider_16.score,
								16
							)}
						</div>
					</div>
				</Dialog>
			</>
		);
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

	const selectRiders = (clubId, number, homeAway) => {
		if (number === 8) {
			return riders
				.filter(
					filtered =>
						filtered.clubId === clubId &&
						isU23(filtered.dateOfBirth)
				)
				.map((rider, index) => {
					return (
						<MenuItem key={rider._id} value={rider._id}>
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
						<MenuItem key={rider._id} value={rider._id}>
							{rider.firstName} {rider.lastName}
						</MenuItem>
					);
				});
		} else {
			return riders
				.filter(filtered => filtered.clubId == clubId)
				.map((rider, index) => {
					return (
						<MenuItem key={rider._id} value={rider._id}>
							{rider.firstName} {rider.lastName}
						</MenuItem>
					);
				});
		}
	};

	const handleMatchDateOnChange = date => {
		setMatchDateEdit(date);
	};

	const sumEditPoints = homeAway => {
		let sum = 0;
		if (homeAway === 'home') {
			sum =
				matchRidersEdit.rider_9.points +
				matchRidersEdit.rider_10.points +
				matchRidersEdit.rider_11.points +
				matchRidersEdit.rider_12.points +
				matchRidersEdit.rider_13.points +
				matchRidersEdit.rider_14.points +
				matchRidersEdit.rider_15.points +
				matchRidersEdit.rider_16.points;
		} else {
			sum =
				matchRidersEdit.rider_1.points +
				matchRidersEdit.rider_2.points +
				matchRidersEdit.rider_3.points +
				matchRidersEdit.rider_4.points +
				matchRidersEdit.rider_5.points +
				matchRidersEdit.rider_6.points +
				matchRidersEdit.rider_7.points +
				matchRidersEdit.rider_8.points;
		}
		return sum;
	};

	const selectRidersFields = () => {
		if (wasRiddenEdit && home && away) {
			return (
				<>
					<div className="add-match__away-div">
						<span className="list-matches-match__clubName">
							AWAY
						</span>
						<br />
						<span className="list-matches-match__clubName">
							{away.name}
						</span>
						<br />
						{sumEditPoints('away')}
						<br />
						<div className="add-match__rider-div">
							1.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_1.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_1',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.clubId, 1, 'away')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_1.points || ''}
								onChange={handleOnChangePoints(
									'rider_1',
									'away'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_1.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_1',
									'away'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							2.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_2.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_2',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.clubId, 2, 'away')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_2.points || ''}
								onChange={handleOnChangePoints(
									'rider_2',
									'away'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_2.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_2',
									'away'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							3.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_3.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_3',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.clubId, 3, 'away')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_3.points || ''}
								onChange={handleOnChangePoints(
									'rider_3',
									'away'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_3.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_3',
									'away'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							4.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_4.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_4',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.clubId, 4, 'away')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_4.points || ''}
								onChange={handleOnChangePoints(
									'rider_4',
									'away'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_4.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_4',
									'away'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							5.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_5.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_5',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.clubId, 5, 'away')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_5.points || ''}
								onChange={handleOnChangePoints(
									'rider_5',
									'away'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_5.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_5',
									'away'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							6.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_6.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_6',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.clubId, 6, 'away')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_6.points || ''}
								onChange={handleOnChangePoints(
									'rider_6',
									'away'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_6.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_6',
									'away'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							7.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_7.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_7',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.clubId, 7, 'away')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_7.points || ''}
								onChange={handleOnChangePoints(
									'rider_7',
									'away'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_7.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_7',
									'away'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							8.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_8.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_8',
									'away'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(away.clubId, 8, 'away')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_8.points || ''}
								onChange={handleOnChangePoints(
									'rider_8',
									'away'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_8.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_8',
									'away'
								)}
							/>
						</div>
					</div>
					<div className="add-match__home-div">
						<span className="list-matches-match__clubName">
							HOME
						</span>
						<br />
						<span className="list-matches-match__clubName">
							{home.name}
						</span>
						<br />
						{sumEditPoints('home')}
						<br />
						<div className="add-match__rider-div">
							9.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_9.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_1',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.clubId, 1, 'home')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_9.points || ''}
								onChange={handleOnChangePoints(
									'rider_1',
									'home'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_9.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_1',
									'home'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							10.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_10.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_2',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.clubId, 2, 'home')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_10.points || ''}
								onChange={handleOnChangePoints(
									'rider_2',
									'home'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_10.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_2',
									'home'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							11.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_11.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_3',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.clubId, 3, 'home')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_11.points || ''}
								onChange={handleOnChangePoints(
									'rider_3',
									'home'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_11.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_3',
									'home'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							12.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_12.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_4',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.clubId, 4, 'home')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_12.points || ''}
								onChange={handleOnChangePoints(
									'rider_4',
									'home'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_12.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_4',
									'home'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							13.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_13.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_5',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.clubId, 5, 'home')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_13.points || ''}
								onChange={handleOnChangePoints(
									'rider_5',
									'home'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_13.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_5',
									'home'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							14.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_14.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_6',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.clubId, 6, 'home')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_14.points || ''}
								onChange={handleOnChangePoints(
									'rider_6',
									'home'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_14.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_6',
									'home'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							15.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_15.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_7',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.clubId, 7, 'home')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_15.points || ''}
								onChange={handleOnChangePoints(
									'rider_7',
									'home'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_15.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_7',
									'home'
								)}
							/>
						</div>
						<div className="add-match__rider-div">
							16.
							<Select
								className="add-match__rider-select"
								value={matchRidersEdit.rider_16.riderId || ''}
								onChange={handleOnChangeSelectRider(
									'rider_8',
									'home'
								)}
							>
								<MenuItem key="" value="">
									Brak zawodnika
								</MenuItem>
								{selectRiders(home.clubId, 8, 'home')}
							</Select>
							<TextField
								className="add-match__rider-points"
								value={matchRidersEdit.rider_16.points || ''}
								onChange={handleOnChangePoints(
									'rider_8',
									'home'
								)}
							/>
							<TextField
								className="add-match__rider-heats"
								value={matchRidersEdit.rider_16.heats || ''}
								onChange={handleOnChangeHeats(
									'rider_8',
									'home'
								)}
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
						<span className="list-matches-match__clubName">
							AWAY
						</span>
						<br />
						{away ? (
							<span className="list-matches-match__clubName">
								{away.name}
							</span>
						) : (
							''
						)}
						<br />
					</div>
					<div className="add-match__home-div">
						<span className="list-matches-match__clubName">
							HOME
						</span>
						<br />
						{home ? (
							<span className="list-matches-match__clubName">
								{home.name}
							</span>
						) : (
							''
						)}
						<br />
					</div>
				</>
			);
		}
	};

	const handleOnChangeSelectRider = (
		number: string,
		homeAway: string
	) => event => {
		event.persist();
		let rider = parseInt(number.slice(-1));
		if (event.target) {
			if (homeAway === 'away') {
				const name = `rider_${rider}`;
				switch (rider) {
					case 1:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_1.points,
								heats: matchRidersEdit.rider_1.heats
							}
						}));
						break;
					case 2:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_2.points,
								heats: matchRidersEdit.rider_2.heats
							}
						}));
						break;
					case 3:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_3.points,
								heats: matchRidersEdit.rider_3.heats
							}
						}));
						break;
					case 4:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_4.points,
								heats: matchRidersEdit.rider_4.heats
							}
						}));
						break;
					case 5:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_5.points,
								heats: matchRidersEdit.rider_5.heats
							}
						}));
						break;
					case 6:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_6.points,
								heats: matchRidersEdit.rider_6.heats
							}
						}));
						break;
					case 7:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_7.points,
								heats: matchRidersEdit.rider_7.heats
							}
						}));
						break;
					case 8:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_8.points,
								heats: matchRidersEdit.rider_8.heats
							}
						}));
						break;
					default:
						break;
				}
			} else {
				rider = rider + 8;
				const name = `rider_${rider}`;
				switch (rider) {
					case 9:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_9.points,
								heats: matchRidersEdit.rider_9.heats
							}
						}));
						break;
					case 10:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_10.points,
								heats: matchRidersEdit.rider_10.heats
							}
						}));
						break;
					case 11:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_11.points,
								heats: matchRidersEdit.rider_11.heats
							}
						}));
						break;
					case 12:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_12.points,
								heats: matchRidersEdit.rider_12.heats
							}
						}));
						break;
					case 13:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_13.points,
								heats: matchRidersEdit.rider_13.heats
							}
						}));
						break;
					case 14:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_14.points,
								heats: matchRidersEdit.rider_14.heats
							}
						}));
						break;
					case 15:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_15.points,
								heats: matchRidersEdit.rider_15.heats
							}
						}));
						break;
					case 16:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: event.target.value,
								points: matchRidersEdit.rider_16.points,
								heats: matchRidersEdit.rider_16.heats
							}
						}));
						break;
					default:
						break;
				}
			}
		}
	};

	const handleOnChangePoints = (rider: string, homeAway: string) => (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		let number = parseInt(rider.slice(-1));
		if (event.target) {
			if (homeAway === 'away') {
				const name = `rider_${number}`;
				switch (number) {
					case 1:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_1.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_1.heats
							}
						}));
						break;
					case 2:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_2.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_2.heats
							}
						}));
						break;
					case 3:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_3.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_3.heats
							}
						}));
						break;
					case 4:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_4.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_4.heats
							}
						}));
						break;
					case 5:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_5.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_5.heats
							}
						}));
						break;
					case 6:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_6.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_6.heats
							}
						}));
						break;
					case 7:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_7.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_7.heats
							}
						}));
						break;
					case 8:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_8.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_8.heats
							}
						}));
						break;
					default:
						break;
				}
			} else {
				number = number + 8;
				const name = `rider_${number}`;
				switch (number) {
					case 9:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_9.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_9.heats
							}
						}));
						break;
					case 10:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_10.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_10.heats
							}
						}));
						break;
					case 11:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_11.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_11.heats
							}
						}));
						break;
					case 12:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_12.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_12.heats
							}
						}));
						break;
					case 13:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_13.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_13.heats
							}
						}));
						break;
					case 14:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_14.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_14.heats
							}
						}));
						break;
					case 15:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_15.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_15.heats
							}
						}));
						break;
					case 16:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_16.riderId,
								points: parseInt(event.target.value) || 0,
								heats: matchRidersEdit.rider_16.heats
							}
						}));
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
		let number = parseInt(rider.slice(-1));
		if (event.target) {
			if (homeAway === 'away') {
				const name = `rider_${number}`;
				switch (number) {
					case 1:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_1.riderId,
								points: matchRidersEdit.rider_1.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 2:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_2.riderId,
								points: matchRidersEdit.rider_2.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 3:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_3.riderId,
								points: matchRidersEdit.rider_3.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 4:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_4.riderId,
								points: matchRidersEdit.rider_4.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 5:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_5.riderId,
								points: matchRidersEdit.rider_5.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 6:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_6.riderId,
								points: matchRidersEdit.rider_6.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 7:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_7.riderId,
								points: matchRidersEdit.rider_7.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 8:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_8.riderId,
								points: matchRidersEdit.rider_8.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					default:
						break;
				}
			} else {
				number = number + 8;
				const name = `rider_${number}`;
				switch (number) {
					case 9:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_9.riderId,
								points: matchRidersEdit.rider_9.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 10:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_10.riderId,
								points: matchRidersEdit.rider_10.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 11:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_11.riderId,
								points: matchRidersEdit.rider_11.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 12:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_12.riderId,
								points: matchRidersEdit.rider_12.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 13:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_13.riderId,
								points: matchRidersEdit.rider_13.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 14:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_14.riderId,
								points: matchRidersEdit.rider_14.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 15:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_15.riderId,
								points: matchRidersEdit.rider_15.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					case 16:
						setMatchRidersEdit((prevState: IRidersEdit) => ({
							...prevState,
							[name]: {
								riderId: matchRidersEdit.rider_16.riderId,
								points: matchRidersEdit.rider_16.points,
								heats: parseInt(event.target.value) || 0
							}
						}));
						break;
					default:
						break;
				}
			}
		}
	};

	const handleOnChangeCheckbox = event => {
		event.persist();
		if (event.target) {
			setWasRiddenEdit(event.target.checked);
		}
	};

	const onClickEditButton = () => {
		checkDate();
		submitEditing();
	};

	const generateEditDialog = () => {
		return (
			<Dialog
				open={openEdit}
				onClose={handleCloseEdit}
				className="edit-dialog"
				fullWidth={true}
				maxWidth={'md'}
			>
				<div className="edit-dialog__div">
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							margin="normal"
							id="date-picker-dialog-1"
							format="dd/MM/yyyy"
							value={matchDateEdit}
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
						checked={wasRiddenEdit}
					/>
					<br />
					<div className="edit-dialog__riders">
						{selectRidersFields()}
					</div>
					<Button onClick={onClickEditButton} className="btn">
						Edytuj
					</Button>
				</div>
			</Dialog>
		);
	};

	const checkIfNew = (riderId, number, points, heats) => {
		if (riderId !== '') {
			if (number < 9) {
				if (riderId === matchRiders.rider_1.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_2.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_3.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_4.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_5.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_6.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_7.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_8.riderId) {
					return true;
				}
			} else {
				if (riderId === matchRiders.rider_9.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_10.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_11.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_12.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_13.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_14.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_15.riderId) {
					return true;
				} else if (riderId === matchRiders.rider_16.riderId) {
					return true;
				}
			}

			addNewRiderMatch(riderId, matchId, number, points, heats);
		}
	};

	const checkIfChanged = (riderId, matchId, number, points, heats) => {
		if (riderId !== '') {
			if (number < 9) {
				if (riderId === matchRidersEdit.rider_1.riderId) {
					if (
						points !== matchRidersEdit.rider_1.points ||
						number !== 1 ||
						heats !== matchRidersEdit.rider_1.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							1,
							matchRidersEdit.rider_1.points,
							matchRidersEdit.rider_1.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_2.riderId) {
					if (
						points !== matchRidersEdit.rider_2.points ||
						number !== 2 ||
						heats !== matchRidersEdit.rider_2.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							2,
							matchRidersEdit.rider_2.points,
							matchRidersEdit.rider_2.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_3.riderId) {
					if (
						points !== matchRidersEdit.rider_3.points ||
						number !== 3 ||
						heats !== matchRidersEdit.rider_3.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							3,
							matchRidersEdit.rider_3.points,
							matchRidersEdit.rider_3.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_4.riderId) {
					if (
						points !== matchRidersEdit.rider_4.points ||
						number !== 4 ||
						heats !== matchRidersEdit.rider_4.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							4,
							matchRidersEdit.rider_4.points,
							matchRidersEdit.rider_4.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_5.riderId) {
					if (
						points !== matchRidersEdit.rider_5.points ||
						number !== 5 ||
						heats !== matchRidersEdit.rider_5.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							5,
							matchRidersEdit.rider_5.points,
							matchRidersEdit.rider_5.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_6.riderId) {
					if (
						points !== matchRidersEdit.rider_6.points ||
						number !== 6 ||
						heats !== matchRidersEdit.rider_6.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							6,
							matchRidersEdit.rider_6.points,
							matchRidersEdit.rider_6.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_7.riderId) {
					if (
						points !== matchRidersEdit.rider_7.points ||
						number !== 7 ||
						heats !== matchRidersEdit.rider_7.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							7,
							matchRidersEdit.rider_7.points,
							matchRidersEdit.rider_7.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_8.riderId) {
					if (
						points !== matchRidersEdit.rider_8.points ||
						number !== 8 ||
						heats !== matchRidersEdit.rider_8.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							8,
							matchRidersEdit.rider_8.points,
							matchRidersEdit.rider_8.heats
						);
					}
					return true;
				}
			} else {
				if (riderId === matchRidersEdit.rider_9.riderId) {
					if (
						points !== matchRidersEdit.rider_9.points ||
						number !== 9 ||
						heats !== matchRidersEdit.rider_9.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							9,
							matchRidersEdit.rider_9.points,
							matchRidersEdit.rider_9.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_10.riderId) {
					if (
						points !== matchRidersEdit.rider_10.points ||
						number !== 10 ||
						heats !== matchRidersEdit.rider_10.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							10,
							matchRidersEdit.rider_10.points,
							matchRidersEdit.rider_10.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_11.riderId) {
					if (
						points !== matchRidersEdit.rider_11.points ||
						number !== 11 ||
						heats !== matchRidersEdit.rider_11.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							11,
							matchRidersEdit.rider_11.points,
							matchRidersEdit.rider_11.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_12.riderId) {
					if (
						points !== matchRidersEdit.rider_12.points ||
						number !== 12 ||
						heats !== matchRidersEdit.rider_12.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							12,
							matchRidersEdit.rider_12.points,
							matchRidersEdit.rider_12.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_13.riderId) {
					if (
						points !== matchRidersEdit.rider_13.points ||
						number !== 13 ||
						heats !== matchRidersEdit.rider_13.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							13,
							matchRidersEdit.rider_13.points,
							matchRidersEdit.rider_13.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_14.riderId) {
					if (
						points !== matchRidersEdit.rider_14.points ||
						number !== 14 ||
						heats !== matchRidersEdit.rider_14.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							14,
							matchRidersEdit.rider_14.points,
							matchRidersEdit.rider_14.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_15.riderId) {
					if (
						points !== matchRidersEdit.rider_15.points ||
						number !== 15 ||
						heats !== matchRidersEdit.rider_15.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							15,
							matchRidersEdit.rider_15.points,
							matchRidersEdit.rider_15.heats
						);
					}
					return true;
				} else if (riderId === matchRidersEdit.rider_16.riderId) {
					if (
						points !== matchRidersEdit.rider_16.points ||
						number !== 16 ||
						heats !== matchRidersEdit.rider_16.heats
					) {
						patchRiderMatch(
							matchId,
							riderId,
							16,
							matchRidersEdit.rider_16.points,
							matchRidersEdit.rider_16.heats
						);
					}
					return true;
				}
			}
			deleteRiderMatch(matchId, riderId);
		}
	};

	const addNewRiderMatch = async (
		riderId,
		matchId,
		number,
		points,
		heats
	) => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.post(
				`https://fantasy-league-eti.herokuapp.com/matches/${matchId}/riders`,
				{
					riderId: riderId,
					score: points,
					heats: heats,
					riderNumber: number
				},
				options
			);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się dodać zawodnika do meczu',
					'danger',
					3000
				);
			}
		}
	};

	const patchRiderMatch = async (matchId, riderId, number, points, heats) => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.patch(
				`https://fantasy-league-eti.herokuapp.com/matches/${matchId}/riders/${riderId}`,
				{
					score: points,
					heats: heats,
					riderNumber: number
				},
				options
			);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się edytować zawodnika w meczu',
					'danger',
					3000
				);
			}
		}
	};

	const deleteRiderMatch = async (matchId, riderId) => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.delete(
				`https://fantasy-league-eti.herokuapp.com/matches/${matchId}/riders/${riderId}`,
				options
			);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się usunąć zawodnika z meczu',
					'danger',
					3000
				);
			}
		}
	};

	const submitEditing = () => {
		checkIfNew(
			matchRidersEdit.rider_1.riderId,
			1,
			matchRidersEdit.rider_1.points,
			matchRidersEdit.rider_1.heats
		);
		checkIfNew(
			matchRidersEdit.rider_2.riderId,
			2,
			matchRidersEdit.rider_2.points,
			matchRidersEdit.rider_2.heats
		);
		checkIfNew(
			matchRidersEdit.rider_3.riderId,
			3,
			matchRidersEdit.rider_3.points,
			matchRidersEdit.rider_3.heats
		);
		checkIfNew(
			matchRidersEdit.rider_4.riderId,
			4,
			matchRidersEdit.rider_4.points,
			matchRidersEdit.rider_4.heats
		);
		checkIfNew(
			matchRidersEdit.rider_5.riderId,
			5,
			matchRidersEdit.rider_5.points,
			matchRidersEdit.rider_5.heats
		);
		checkIfNew(
			matchRidersEdit.rider_6.riderId,
			6,
			matchRidersEdit.rider_6.points,
			matchRidersEdit.rider_6.heats
		);
		checkIfNew(
			matchRidersEdit.rider_7.riderId,
			7,
			matchRidersEdit.rider_7.points,
			matchRidersEdit.rider_7.heats
		);
		checkIfNew(
			matchRidersEdit.rider_8.riderId,
			8,
			matchRidersEdit.rider_8.points,
			matchRidersEdit.rider_8.heats
		);
		checkIfNew(
			matchRidersEdit.rider_9.riderId,
			9,
			matchRidersEdit.rider_9.points,
			matchRidersEdit.rider_9.heats
		);
		checkIfNew(
			matchRidersEdit.rider_10.riderId,
			10,
			matchRidersEdit.rider_10.points,
			matchRidersEdit.rider_10.heats
		);
		checkIfNew(
			matchRidersEdit.rider_11.riderId,
			11,
			matchRidersEdit.rider_11.points,
			matchRidersEdit.rider_11.heats
		);
		checkIfNew(
			matchRidersEdit.rider_12.riderId,
			12,
			matchRidersEdit.rider_12.points,
			matchRidersEdit.rider_12.heats
		);
		checkIfNew(
			matchRidersEdit.rider_13.riderId,
			13,
			matchRidersEdit.rider_13.points,
			matchRidersEdit.rider_13.heats
		);
		checkIfNew(
			matchRidersEdit.rider_14.riderId,
			14,
			matchRidersEdit.rider_14.points,
			matchRidersEdit.rider_14.heats
		);
		checkIfNew(
			matchRidersEdit.rider_15.riderId,
			15,
			matchRidersEdit.rider_15.points,
			matchRidersEdit.rider_15.heats
		);
		checkIfNew(
			matchRidersEdit.rider_16.riderId,
			16,
			matchRidersEdit.rider_16.points,
			matchRidersEdit.rider_16.heats
		);

		checkIfChanged(
			matchRiders.rider_1.riderId,
			matchId,
			matchRiders.rider_1.riderNumber,
			matchRiders.rider_1.score,
			matchRiders.rider_1.heats
		);
		checkIfChanged(
			matchRiders.rider_2.riderId,
			matchId,
			matchRiders.rider_2.riderNumber,
			matchRiders.rider_2.score,
			matchRiders.rider_2.heats
		);
		checkIfChanged(
			matchRiders.rider_3.riderId,
			matchId,
			matchRiders.rider_3.riderNumber,
			matchRiders.rider_3.score,
			matchRiders.rider_3.heats
		);
		checkIfChanged(
			matchRiders.rider_4.riderId,
			matchId,
			matchRiders.rider_4.riderNumber,
			matchRiders.rider_4.score,
			matchRiders.rider_4.heats
		);
		checkIfChanged(
			matchRiders.rider_5.riderId,
			matchId,
			matchRiders.rider_5.riderNumber,
			matchRiders.rider_5.score,
			matchRiders.rider_5.heats
		);
		checkIfChanged(
			matchRiders.rider_6.riderId,
			matchId,
			matchRiders.rider_6.riderNumber,
			matchRiders.rider_6.score,
			matchRiders.rider_6.heats
		);
		checkIfChanged(
			matchRiders.rider_7.riderId,
			matchId,
			matchRiders.rider_7.riderNumber,
			matchRiders.rider_7.score,
			matchRiders.rider_7.heats
		);
		checkIfChanged(
			matchRiders.rider_8.riderId,
			matchId,
			matchRiders.rider_8.riderNumber,
			matchRiders.rider_8.score,
			matchRiders.rider_8.heats
		);
		checkIfChanged(
			matchRiders.rider_9.riderId,
			matchId,
			matchRiders.rider_9.riderNumber,
			matchRiders.rider_9.score,
			matchRiders.rider_9.heats
		);
		checkIfChanged(
			matchRiders.rider_10.riderId,
			matchId,
			matchRiders.rider_10.riderNumber,
			matchRiders.rider_10.score,
			matchRiders.rider_10.heats
		);
		checkIfChanged(
			matchRiders.rider_11.riderId,
			matchId,
			matchRiders.rider_11.riderNumber,
			matchRiders.rider_11.score,
			matchRiders.rider_11.heats
		);
		checkIfChanged(
			matchRiders.rider_12.riderId,
			matchId,
			matchRiders.rider_12.riderNumber,
			matchRiders.rider_12.score,
			matchRiders.rider_12.heats
		);
		checkIfChanged(
			matchRiders.rider_13.riderId,
			matchId,
			matchRiders.rider_13.riderNumber,
			matchRiders.rider_13.score,
			matchRiders.rider_13.heats
		);
		checkIfChanged(
			matchRiders.rider_14.riderId,
			matchId,
			matchRiders.rider_14.riderNumber,
			matchRiders.rider_14.score,
			matchRiders.rider_14.heats
		);
		checkIfChanged(
			matchRiders.rider_15.riderId,
			matchId,
			matchRiders.rider_15.riderNumber,
			matchRiders.rider_15.score,
			matchRiders.rider_15.heats
		);
		checkIfChanged(
			matchRiders.rider_16.riderId,
			matchId,
			matchRiders.rider_16.riderNumber,
			matchRiders.rider_16.score,
			matchRiders.rider_16.heats
		);

		addNotification('Sukces', 'Udało się edytować mecz', 'success', 1000);

		setHomeScoreEdit(sumEditPoints('home'));
		setAwayScoreEdit(sumEditPoints('away'));
		getMatchRiders();

		setTimeout(() => {
			handleCloseEdit();
		}, 1000);
	};

	const checkDate = async () => {
		if (matchDateEdit != date || wasRidden != wasRiddenEdit) {
			try {
				const accessToken = getToken();
				const options = {
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
				const { data } = await axios.patch(
					`https://fantasy-league-eti.herokuapp.com/matches/${matchId}`,
					{ date: matchDateEdit, wasRidden: wasRiddenEdit },
					options
				);
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				} else {
					addNotification(
						'Błąd',
						'Nie udało się edytować meczu w bazie',
						'danger',
						3000
					);
				}
			}
		}
	};

	useEffect(() => {
		setLoading(true);
		(async function () {
			try {
				await getClub(homeId, 'home');
				await getClub(awayId, 'away');
			} catch (e) {
				const {
					response: { data }
				} = e;
				addNotification(
					'Błąd!',
					'Nie udało się pobrać danych z bazy',
					'danger',
					1500
				);
			}
			setLoading(false);
		})();
	}, []);

	return (
		<>
			<div className={isHidden ? 'hidden' : ''}>
				{generateMatchDiv()}
				{generateScoresDialog()}
				{generateEditDialog()}
			</div>
		</>
	);
};

export default ListMatchesMatch;
