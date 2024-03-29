import { ValidationErrorItem } from '@hapi/joi';
import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
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
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography
} from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { FiPlus, FiX, FiXCircle } from 'react-icons/fi';
import { Redirect, RouteComponentProps, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import addNotification from '../utils/addNotification';
import checkAdminRole from '../utils/checkAdminRole';
import { checkBadAuthorization, checkCookies } from '../utils/checkCookies';
import fetchUserData from '../utils/fetchUserData';
import getToken from '../utils/getToken';
import validateLeagueData from '../validation/validateLeagueData';
import { useStateValue } from './AppProvider';
import RemoveDialog from './RemoveDialog';

interface IValidatedData {
	name: {
		message: string;
		error: boolean;
	};
	country: {
		message: string;
		error: boolean;
	};
}

interface ILeague {
	_id: string;
	name: string;
}

const Leagues: FunctionComponent<RouteComponentProps> = () => {
	const { setLoggedIn, dispatchUserData, userData } = useStateValue();

	const [leagues, setLeagues] = useState([]);
	const [addLeagueName, setAddLeagueName] = useState<string>('');
	const [addLeagueCountry, setAddLeagueCountry] = useState<string>('Polska');
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [removeDialog, setRemoveDialog] = useState(false);
	const [league, setLeague] = useState<ILeague>();
	const [loading, setLoading] = useState<boolean>(true);
	const [clubs, setClubs] = useState([]);
	const isAdmin = checkAdminRole(userData.role) && checkCookies();
	const { push } = useHistory();

	const defaultValidatedData = {
		name: {
			message: '',
			error: false
		},
		country: {
			message: '',
			error: false
		}
	};

	const [validatedData, setValidatedData] = useState<IValidatedData>(
		defaultValidatedData
	);

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setAddLeagueCountry('Polska');
		setAddLeagueName('');
	};

	const handleRemoveOpen = (league: ILeague) => () => {
		setRemoveDialog(true);
		setLeague(league);
	};

	const handleRemoveClose = () => setRemoveDialog(false);

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

			setClubs(data);
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
	}

	const getLeagues = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/leagues',
				options
			);

			setLeagues(data);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się pobrać lig z bazy',
					'danger',
					3000
				);
			}
		}
	};

	const addLeague = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.post(
				'https://fantasy-league-eti.herokuapp.com/leagues',
				{
					name: addLeagueName,
					country: addLeagueCountry
				},
				options
			);
			addNotification(
				'Sukces!',
				'Udało się dodać ligę!',
				'success',
				1000
			);
			setLeagues(leagues =>
				leagues.concat({
					_id: data._id,
					name: addLeagueName,
					country: addLeagueCountry
				})
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
					'Nie udało się dodać ligi do bazy',
					'danger',
					3000
				);
			}
		}
	};

	const deleteLeague = async id => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			await axios.delete(
				`https://fantasy-league-eti.herokuapp.com/leagues/${id}`,
				options
			);
			addNotification(
				'Sukces!',
				'Udało się usunąć ligę!',
				'success',
				1000
			);
			setLeagues(leagues.filter(league => league._id !== id));
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się usunąć ligi z bazy',
					'danger',
					3000
				);
			}
		}
	};

	const checkIfCanDeleteLeague = id => {
		const tempClubs = clubs.filter(club => club.leagueId === id);
		if(tempClubs.length === 0){
			return true;
		} else {
			return false;
		}
	}

	const renderTableData = () => {
		return leagues.map(league => {
			return (
				<TableRow key={league._id}>
					<TableCell>{league.name}</TableCell>
					<TableCell>{league.country}</TableCell>
					<TableCell className="table-X">
					{isAdmin && checkIfCanDeleteLeague(league._id) ? 
							<IconButton
								onClick={handleRemoveOpen({
									_id: league._id,
									name: league.name
								})}
								className="leagues__delete-button"
							>
								<FiXCircle />
							</IconButton> : null}
					</TableCell>
				</TableRow>
			);
		});
	};

	const generateTable = () => {
		return (
			<div className="leagues-table">
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>NAZWA</TableCell>
								<TableCell>KRAJ</TableCell>
								{isAdmin && <TableCell>USUŃ</TableCell>}
							</TableRow>
						</TableHead>
						<TableBody>{renderTableData()}</TableBody>
					</Table>
				</TableContainer>
			</div>
		);
	};

	const handleOnChangeName = () => (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		if (event.target) {
			setAddLeagueName(event.target.value);
		}
	};

	const handleOnChangeCountry = () => event => {
		event.persist();
		if (event.target) {
			setAddLeagueCountry(event.target.value);
		}
	};

	const handleOnSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const validationResponse = validateLeagueData({
			name: addLeagueName,
			country: addLeagueCountry
		});
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
			handleCloseDialog();
			addLeague();
		}
	};

	useEffect(() => {
		setLoading(true);
		(async function () {
			try {
				await getLeagues();
				await getClubs();
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
						'Błąd!',
						'Nie udało się pobrać danych z bazy',
						'danger',
						1500
					);
				}
			}
			setLoading(false);
		})();
		setTimeout(() => {
			document.body.style.overflow = 'auto';
		}, 500);
	}, []);

	const generateDialog = () => {
		return (
			<>
				<div>
					<Dialog
						open={openDialog}
						onClose={handleCloseDialog}
						className="leagues-dialog"
					>
						<DialogTitle>
							<div className="leagues-dialog__header">
								<Typography
									variant="h4"
									className="leagues-dialog__title"
								>
									Dodawanie ligi
								</Typography>
								<IconButton
									onClick={handleCloseDialog}
									className="leagues-dialog__fix"
								>
									<FiX />
								</IconButton>
							</div>
						</DialogTitle>
						<DialogContent dividers>
							<form
								className="leagues-dialog__form"
								onSubmit={handleOnSubmit}
							>
								<Grid container>
									<Grid
										item
										xs={7}
										className="leagues-dialog__fields"
									>
										<FormControl className="leagues-dialog__text-field">
											<TextField
												label="Nazwa ligi"
												required
												autoComplete="league"
												value={addLeagueName}
												error={validatedData.name.error}
												helperText={
													validatedData.name.message
												}
												onChange={handleOnChangeName()}
											/>
										</FormControl>
										<FormControl className="leagues-dialog__select-field">
											Kraj:
											<Select
												value={addLeagueCountry || ''}
												onChange={handleOnChangeCountry()}
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
				</div>
			</>
		);
	};

	return (
		<>
			<div className="leagues">
				<div className="leagues__background"></div>
				<Paper className="leagues__box">
					<Typography
						variant="h2"
						className="heading-1 leagues__heading"
					>
						Ligi
					</Typography>
					<Divider />
					<br />
					{isAdmin && <IconButton
						onClick={handleOpenDialog}
						className="leagues__fiplus"
					>
						<FiPlus />
					</IconButton>}
					{loading && (
						<Grid container justify="center" alignItems="center">
							<CircularProgress />
						</Grid>
					)}
					<CSSTransition
						in={leagues.length > 0}
						timeout={300}
						classNames="animationScaleUp"
						unmountOnExit
					>
						<div className="leagues-table">
							{generateTable()}
							{generateDialog()}
						</div>
					</CSSTransition>
				</Paper>
			</div>
			<RemoveDialog
				removeDialog={removeDialog}
				handleRemoveClose={handleRemoveClose}
				title="Czy chcesz usunąć ligę?"
				removeFunction={async () => deleteLeague(league._id)}
			/>
		</>
	);
};

export default Leagues;
