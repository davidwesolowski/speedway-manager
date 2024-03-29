import React, {
	ChangeEvent,
	FormEvent,
	FunctionComponent,
	useEffect,
	useState
} from 'react';
import { RouteProps, useHistory } from 'react-router-dom';
import {
	Avatar,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogTitle,
	Divider,
	FormControl,
	Grid,
	IconButton,
	MenuItem,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography
} from '@material-ui/core';
import axios from 'axios';
import TeamCreate from './TeamCreate';
import { useStateValue } from './AppProvider';
import fetchUserData from '../utils/fetchUserData';
import getToken from '../utils/getToken';
import { checkBadAuthorization, checkCookies } from '../utils/checkCookies';
import addNotification from '../utils/addNotification';
import { CSSTransition } from 'react-transition-group';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import checkAdminRole from '../utils/checkAdminRole';
import { FiArrowRightCircle } from 'react-icons/fi';
import RemoveDialog from './RemoveDialog';
import Popup from './Popup';
import TeamRiders, { IRider } from './TeamRiders';

interface ILeague {
	_id: string;
	name: string;
	country: string;
}

export interface IClub {
	_id: string;
	name: string;
	imageUrl: string | null;
	leagueName: string;
}

const defaultLeague: ILeague = {
	_id: '',
	name: '',
	country: ''
};

const defaultClub: IClub = {
	_id: '',
	name: '',
	imageUrl: '',
	leagueName: ''
};

const ClubLeagueCreate: FunctionComponent<RouteProps> = () => {
	const [league, setLeague] = useState(defaultLeague);
	const [leagues, setLeagues] = useState<ILeague[]>([]);
	const [club, setClub] = useState<IClub>(defaultClub);
	const [clubs, setClubs] = useState<IClub[]>([]);
	const [loading, setLoading] = useState(true);
	const [removeDialog, setRemoveDialog] = useState(false);
	const [updateClub, setUpdateClub] = useState(false);
	const [ridersOfClub, setRidersOfClub] = useState<IRider[]>([]);
	const [clubName, setCLubName] = useState('');
	const [ridersDialog, setRidersDialog] = useState(false);
	const { dispatchUserData, setLoggedIn, userData } = useStateValue();
	const { push } = useHistory();
	const isAdmin = checkCookies() && checkAdminRole(userData.role);

	const handleShowRemoveDialog = (id: string) => () => {
		setRemoveDialog(true);
		const club = clubs.find(club => club._id === id);
		setClub(club);
	};
	const handleCloseRemoveDialog = () => {
		setRemoveDialog(false);
		setClub(defaultClub);
	};

	const handleRidersOpen = () => setRidersDialog(true);

	const handleRidersClose = () => {
		setRidersOfClub([]);
		setCLubName('');
		setRidersDialog(false);
	};

	const handleShowEdit = (id: string) => () => {
		const club = clubs.find(club => club._id === id);
		setClub(club);
	};

	const removeClub = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { _id } = club;
			if (_id) {
				await axios.delete(
					`https://fantasy-league-eti.herokuapp.com/clubs/${_id}`,
					options
				);
				setClubs(clubs.filter(club => club._id !== _id));
				setClub(defaultClub);
				handleCloseRemoveDialog();
				const title = 'Sukces!';
				const message = 'Pomyślne usunięcie klubu!';
				const type = 'success';
				const duration = 1500;
				addNotification(title, message, type, duration);
			}
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				const title = 'Błąd!';
				const message = 'Nie udało się usunąć klubu!';
				const type = 'danger';
				const duration = 1500;
				addNotification(title, message, type, duration);
			}
		}
	};

	const handleOnChange = (fieldName: string) => (
		event: ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		if (event.target) {
			setLeague(prev => ({
				...prev,
				[fieldName]: event.target.value
			}));
		}
	};

	const handleOnSubmit = async (event: FormEvent) => {
		event.preventDefault();
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		try {
			const countryName = league.country.toLowerCase();
			const country =
				countryName[0].toUpperCase() +
				countryName.slice(1, countryName.length);
			const {
				data: { _id }
			} = await axios.post(
				'https://fantasy-league-eti.herokuapp.com/leagues',
				{
					name: league.name,
					country
				},
				options
			);
			setLeagues([...leagues, { ...league, _id }]);
			setLeague(defaultLeague);
			const title = 'Sukces!';
			const message = 'Pomyślnie dodano ligę!';
			const type = 'success';
			const duration = 1500;
			addNotification(title, message, type, duration);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				const title = 'Błąd!';
				const message = 'Nie udało się dodać ligi!';
				const type = 'danger';
				const duration = 1500;
				addNotification(title, message, type, duration);
			}
		}
	};

	const fetchRidersOfTeam = (id: string, clubName: string) => async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/clubs/${id}/riders`,
				options
			);
			if (data.length) {
				const riders: IRider[] = data.map(({ rider }) => ({
					_id: rider._id,
					firstName: rider.firstName,
					lastName: rider.lastName,
					dateOfBirth: rider.dateOfBirth,
					ksm: Math.round(rider.KSM * 100) / 100,
					image: rider.image
				}));
				setRidersOfClub(riders);
			}
			setCLubName(clubName);
			handleRidersOpen();
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				const title = 'Błąd!';
				const message = 'Nie udało się pobrać zawodników z klubu!';
				const type = 'danger';
				const duration = 1500;
				addNotification(title, message, type, duration);
			}
		}
	};

	const handleOnChangeCountry = (fieldName: string) => event => {
		event.persist();
		if (event.target) {
			setLeague(prev => ({
				...prev,
				[fieldName]: event.target.value
			}));
		}
	};

	const clubsRender = (
		<CSSTransition
			in={clubs.length > 0}
			timeout={300}
			classNames="animationScaleUp"
			unmountOnExit
		>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell align="center">Nazwa</TableCell>
						<TableCell align="center">Liga</TableCell>
						<TableCell align="center">Sprawdź skład</TableCell>
						{isAdmin && (
							<>
								<TableCell align="center">Edytuj</TableCell>
								<TableCell align="center">Usuń</TableCell>
							</>
						)}
					</TableRow>
				</TableHead>
				<TableBody>
					{clubs.map(club => (
						<TableRow key={club.name}>
							<TableCell align="center">
								<Avatar src={club.imageUrl} alt="club-logo" />
							</TableCell>
							<TableCell align="center">{club.name}</TableCell>
							<TableCell align="center">
								{club.leagueName}
							</TableCell>
							<TableCell align="center">
								<IconButton
									onClick={fetchRidersOfTeam(
										club._id,
										club.name
									)}
								>
									<FiArrowRightCircle className="clubLeague__rightArrowButton" />
								</IconButton>
							</TableCell>
							{isAdmin && (
								<>
									<TableCell align="center">
										<IconButton
											onClick={handleShowEdit(club._id)}
										>
											<FaPencilAlt className="clubLeague__iconButton" />
										</IconButton>
									</TableCell>
									<TableCell align="center">
										<IconButton
											onClick={handleShowRemoveDialog(
												club._id
											)}
										>
											<FaTrashAlt className="clubLeague__iconButton" />
										</IconButton>
									</TableCell>
								</>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</CSSTransition>
	);

	useEffect(() => {
		setLoading(true);
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		const fetchLeagues = async () => {
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/leagues',
				options
			);
			const leagues = data.map(({ _id, name, country }) => ({
				_id,
				name,
				country
			}));
			setLeagues(leagues);
			return leagues;
		};

		const fetchClubs = async () => {
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/clubs',
				options
			);
			const leagues = await fetchLeagues();
			const clubs = data.map(club => {
				const league = leagues.find(
					league => league._id === club.leagueId
				);
				if (league)
					return {
						_id: club._id,
						name: club.name,
						imageUrl: club.imageUrl,
						leagueName: league.name
					};
				return {
					_id: club._id,
					name: club.name,
					imageUrl: club.imageUrl,
					leagueName: ''
				};
			});
			setClubs(clubs);
		};
		(async function () {
			try {
				await fetchClubs();
				if (checkCookies() && !userData.username)
					await fetchUserData(dispatchUserData, setLoggedIn, push);
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				} else {
					const title = 'Błąd!';
					const message = 'Nie udało się pobrać danych!';
					const type = 'danger';
					const duration = 1500;
					addNotification(title, message, type, duration);
				}
			}
			setLoading(false);
			setTimeout(() => {
				document.body.style.overflow = 'auto';
			}, 1000);
		})();
	}, [updateClub]);

	return (
		<>
			<div className="clubLeague">
				<div className="clubLeague__img"></div>
				<Paper className="clubLeague__box">
					<Grid container justify="center">
						<Grid item xs={12} md={isAdmin ? 6 : 10}>
							<Typography className="heading-2 clubLeague__clubHeading">
								Kluby
							</Typography>
							<Divider />
							{loading && (
								<Grid
									container
									justify="center"
									alignItems="center"
								>
									<CircularProgress />
								</Grid>
							)}
							{clubsRender}
						</Grid>
						{isAdmin && (
							<Grid item xs={12} md={6}>
								<Grid container>
									<Grid item xs={12}>
										<TeamCreate
											url="https://fantasy-league-eti.herokuapp.com/clubs"
											leagues={leagues}
											isClub={true}
											updatedTeam={updateClub}
											setUpdatedTeam={setUpdateClub}
											editClubData={club}
											setEditClubData={setClub}
										/>
									</Grid>
									<Grid item xs={12}>
										<Typography className="heading-3 clubLeague__heading">
											Utwórz ligę
										</Typography>
										<form
											className="clubLeague__form"
											onSubmit={handleOnSubmit}
										>
											<Grid container justify="center">
												<Grid item xs={12} md={10}>
													<FormControl className="clubLeague__form-field">
														<TextField
															label="Liga"
															required
															value={league.name}
															onChange={handleOnChange(
																'name'
															)}
														/>
													</FormControl>
												</Grid>
												<Grid item xs={12} md={10}>
													<FormControl className="leagues-dialog__select-field">
														Kraj:
														<Select
															value={league.country || ''}
															onChange={handleOnChangeCountry("country")}
														>
															<MenuItem value="Polska">
																Polska
															</MenuItem>
															<MenuItem value="Wielka Brytania">
																Wielka Brytania
															</MenuItem>
															<MenuItem value="Szwecja">
																Szwecja
															</MenuItem>
															<MenuItem value="Dania">
																Dania
															</MenuItem>
														</Select>
													</FormControl>
												</Grid>
												<Grid item xs={12} md={10}>
													<Button
														type="submit"
														className="btn clubLeague__btn"
													>
														Utwórz
													</Button>
												</Grid>
											</Grid>
										</form>
									</Grid>
								</Grid>
							</Grid>
						)}
					</Grid>
				</Paper>
			</div>
			<RemoveDialog
				removeDialog={removeDialog}
				handleRemoveClose={handleCloseRemoveDialog}
				title="Czy na pewno chcesz usunąć drużynę?"
				removeFunction={removeClub}
			/>
			<Popup
				open={ridersDialog}
				handleClose={handleRidersClose}
				title={`Skład klubu: ${clubName}`}
				component={
					ridersOfClub.length ? (
						<CSSTransition
							in={ridersOfClub.length > 0}
							timeout={300}
							classNames="animationScaleUp"
							unmountOnExit
						>
							<TeamRiders riders={ridersOfClub} clubRirders />
						</CSSTransition>
					) : (
						<p className="clubLeague__noRiders">
							Klub nie ma zawodników!
						</p>
					)
				}
			/>
		</>
	);
};

export default ClubLeagueCreate;
