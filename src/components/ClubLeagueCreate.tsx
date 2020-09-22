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
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	Grid,
	IconButton,
	Paper,
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
import { checkBadAuthorization } from '../utils/checkCookies';
import addNotification from '../utils/addNotification';
import { CSSTransition } from 'react-transition-group';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import checkAdminRole from '../utils/checkAdminRole';
import { FiX } from 'react-icons/fi';

interface ILeague {
	_id: string;
	name: string;
	country: string;
}

interface IClub {
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
	const [removeDialog, setRemoveDialog] = useState(false);
	const [editDialog, setEditDialog] = useState(false);
	const [updateClub, setUpdateClub] = useState(false);
	const { dispatchUserData, setLoggedIn, userData } = useStateValue();
	const { push } = useHistory();
	const isAdmin = checkAdminRole(userData.role);

	const handleShowRemoveDialog = (id: string) => () => {
		setRemoveDialog(true);
		const club = clubs.find(club => club._id === id);
		setClub(club);
	};
	const handleCloseRemoveDialog = () => {
		setRemoveDialog(false);
		setClub(defaultClub);
	};

	const handleShowEditDialog = (id: string) => () => {
		setEditDialog(true);
		const club = clubs.find(club => club._id === id);
		setClub(club);
	};

	const handleCloseEditDialog = () => {
		setEditDialog(false);
		setClub(defaultClub);
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
			await axios.post(
				'https://fantasy-league-eti.herokuapp.com/leagues',
				{
					name: league.name,
					country
				},
				options
			);
			setLeagues([...leagues, league]);
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

	const clubsRender = () => (
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
						<TableCell align="center">Edytuj</TableCell>
						<TableCell align="center">Usuń</TableCell>
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
									onClick={handleShowEditDialog(club._id)}
								>
									<FaPencilAlt className="clubLeague__iconButton" />
								</IconButton>
							</TableCell>
							<TableCell align="center">
								<IconButton
									onClick={handleShowRemoveDialog(club._id)}
								>
									<FaTrashAlt className="clubLeague__iconButton" />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</CSSTransition>
	);
	useEffect(() => {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		const fetchLeagues = async () => {
			try {
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
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				} else {
					const title = 'Błąd!';
					const message = 'Nie udało się pobrać lig!';
					const type = 'danger';
					const duration = 1500;
					addNotification(title, message, type, duration);
				}
			}
		};

		const fetchClubs = async () => {
			try {
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
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				} else {
					const title = 'Błąd!';
					const message = 'Nie udało się pobrać klubów!';
					const type = 'danger';
					const duration = 1500;
					addNotification(title, message, type, duration);
				}
			}
		};

		if (!userData.username)
			fetchUserData(dispatchUserData, setLoggedIn, push);

		fetchClubs();
		setTimeout(() => {
			document.body.style.overflow = 'auto';
		}, 1000);
	}, [updateClub]);

	return (
		<>
			<div className="clubLeague">
				<div className="clubLeague__img"></div>
				<Paper className="clubLeague__box">
					<Grid container>
						<Grid item xs={12} md={isAdmin ? 6 : 12}>
							<Typography className="heading-2 clubLeague__clubHeading">
								Kluby
							</Typography>
							<Divider />
							{clubsRender()}
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
													<FormControl className="clubLeague__form-field">
														<TextField
															label="Kraj"
															required
															value={
																league.country
															}
															onChange={handleOnChange(
																'country'
															)}
														/>
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
			<Dialog open={removeDialog} onClose={handleCloseRemoveDialog}>
				<DialogTitle>
					<div>
						<Typography variant="h4" className="dialog__title">
							Czy na pewno chcesz usunąć drużynę?
						</Typography>
					</div>
				</DialogTitle>
				<DialogActions>
					<Button className="btn" onClick={handleCloseRemoveDialog}>
						Anuluj
					</Button>
					<Button
						className="btn dialog__button-approve"
						onClick={removeClub}
					>
						Usuń
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={editDialog} onClose={handleCloseEditDialog}>
				<DialogTitle>
					<div className="dialog__header">
						<Typography variant="h4" className="dialog__title">
							Edycja klubu
						</Typography>
						<IconButton onClick={handleCloseEditDialog}>
							<FiX />
						</IconButton>
					</div>
				</DialogTitle>
				<DialogContent>
					<TeamCreate
						url="https://fantasy-league-eti.herokuapp.com/clubs"
						leagues={leagues}
						isClub={true}
						updatedTeam={updateClub}
						setUpdatedTeam={setUpdateClub}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ClubLeagueCreate;
