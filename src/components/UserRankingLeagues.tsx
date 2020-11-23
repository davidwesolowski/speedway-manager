import React, { FunctionComponent, useEffect, useState } from 'react';
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
	Paper,
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
import { FiPlus, FiX, FiXCircle } from 'react-icons/fi';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import addNotification from '../utils/addNotification';
import { checkBadAuthorization } from '../utils/checkCookies';
import fetchUserData from '../utils/fetchUserData';
import getToken from '../utils/getToken';
import validateUserLeagueData from '../validation/validateUserLeagueData';
import { useStateValue } from './AppProvider';
import RemoveDialog from './RemoveDialog';

interface IValidatedData {
	name: {
		message: string;
		error: boolean;
	};
	mainLeague: {
		message: string;
		error: boolean;
	};
}

interface ILeague {
	_id: string;
	name: string;
}

const defaultValidatedData = {
	name: {
		message: '',
		error: false
	},
	mainLeague: {
		message: '',
		error: false
	}
};

const UserRankingLeagues: FunctionComponent<RouteComponentProps> = () => {
	const { setLoggedIn, dispatchUserData, userData } = useStateValue();
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [removeDialog, setRemoveDialog] = useState(false);
	const [removeMeDialog, setRemoveMeDialog] = useState(false);
	const [addUserLeagueName, setAddUserLeagueName] = useState<string>('');
	const [owns, setOwns] = useState([]);
	const [participates, setParticipates] = useState([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [league, setLeague] = useState<ILeague>();
	const [meLeague, setMeLeague] = useState<ILeague>();
	const { push } = useHistory();

	const [validatedData, setValidatedData] = useState<IValidatedData>(
		defaultValidatedData
	);

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setAddUserLeagueName('');
	};

	const handleRemoveOpen = (league: ILeague) => () => {
		setRemoveDialog(true);
		setLeague(league);
	};

	const handleRemoveClose = () => setRemoveDialog(false);

	const handleRemoveMeOpen = (league: ILeague) => () => {
		setRemoveMeDialog(true);
		setMeLeague(league);
	}

	const handleRemoveMeClose = () => setRemoveMeDialog(false);

	const getUserLeagues = async () => {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		const { data } = await axios.get(
			'https://fantasy-league-eti.herokuapp.com/rankings',
			options
		);
		setOwns(data.owns);
		setParticipates(data.participates);
	};

	const addUserLeague = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.post(
				'https://fantasy-league-eti.herokuapp.com/rankings',
				{ name: addUserLeagueName },
				options
			);
			addNotification(
				'Sukces!',
				'Udało się dodać ranking!',
				'success',
				1000
			);
			setOwns(owns =>
				owns.concat({
					_id: data._id,
					name: addUserLeagueName
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
					'Nie udało się pobrać lig z bazy',
					'danger',
					3000
				);
			}
		}
	};

	const deleteMeFromLeague = async id => {
		try{
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			await axios.delete(
				`https://fantasy-league-eti.herokuapp.com/rankings/${id}/${userData._id}`,
				options
			);
			addNotification(
				'Sukces!',
				'Udało się usunąć ranking!',
				'success',
				1000
			);
			setParticipates(participates.filter(league => league._id !== id));
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				console.log(e.response);
				//checkBadAuthorization(setLoggedIn, push);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się usunąć Ciebie z rankingu',
					'danger',
					3000
				);
			}
		}
	}

	const deleteUserLeague = async id => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			await axios.delete(
				`https://fantasy-league-eti.herokuapp.com/rankings/${id}`,
				options
			);
			addNotification(
				'Sukces!',
				'Udało się usunąć ranking!',
				'success',
				1000
			);
			setOwns(owns.filter(league => league._id !== id));
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
	const renderOwnedTableData = () => {
		return owns.map(({ _id, name }) => {
			return (
				<TableRow key={_id}>
					<TableCell>{name}</TableCell>
					<TableCell className="table-X">
						<IconButton
							onClick={handleRemoveOpen({ _id, name })}
							className="user-leagues__delete-button"
						>
							<FiXCircle />
						</IconButton>
					</TableCell>
				</TableRow>
			);
		});
	};

	const renderParticipatedTableData = () => {
		return participates.map(({ _id, name }) => {
			return (
				<TableRow key={_id}>
					<TableCell>{name}</TableCell>
					<TableCell className="table-X">
						<IconButton
							onClick={handleRemoveMeOpen({ _id, name })}
							className="user-leagues__delete-button"
						>
							<FiX />
						</IconButton>
					</TableCell>
				</TableRow>
			);
		});
	};

	const generateTable = () => {
		return (
			<div className="user-leagues-table">
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>NAZWA</TableCell>
								<TableCell>USUŃ</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{renderOwnedTableData()}
							{renderParticipatedTableData()}
						</TableBody>
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
			setAddUserLeagueName(event.target.value);
		}
	};

	const handleOnSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const validationResponse = validateUserLeagueData({
			name: addUserLeagueName
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
			addUserLeague();
		}
	};

	useEffect(() => {
		setLoading(true);
		(async function () {
			try {
				await getUserLeagues();
				if (!userData.username)
					fetchUserData(dispatchUserData, setLoggedIn, push);
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				} else {
					addNotification(
						'Błąd',
						'Nie udało się pobrać danych z bazy',
						'danger',
						1500
					);
				}
			}
			setLoading(false);
		})();
	}, []);

	const generateDialog = () => {
		return (
			<>
				<div>
					<Dialog
						open={openDialog}
						onClose={handleCloseDialog}
						className="user-leagues-dialog"
					>
						<DialogTitle>
							<div className="user-leagues-dialog__header">
								<Typography
									variant="h4"
									className="user-leagues-dialog__title"
								>
									Dodawanie ligi
								</Typography>
								<IconButton
									onClick={handleCloseDialog}
									className="user-leagues-dialog__fix"
								>
									<FiX />
								</IconButton>
							</div>
						</DialogTitle>
						<DialogContent dividers>
							<form
								className="user-leagues-dialog__form"
								onSubmit={handleOnSubmit}
							>
								<Grid container>
									<Grid
										item
										xs={7}
										className="user-leagues-dialog__fields"
									>
										<FormControl className="user-leagues-dialog__text-field">
											<TextField
												label="Nazwa ligi"
												required
												autoComplete="league"
												value={addUserLeagueName}
												error={validatedData.name.error}
												helperText={
													validatedData.name.message
												}
												onChange={handleOnChangeName()}
											/>
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
			<div className="user-leagues">
				<div className="user-leagues__background"></div>
				<Paper className="user-leagues__box">
					<Typography
						variant="h2"
						className="heading-1 user-leagues__heading"
					>
						Moje Ligi
					</Typography>
					<Divider />
					<br />
					<IconButton
						onClick={handleOpenDialog}
						className="user-leagues__fiplus"
					>
						<FiPlus />
					</IconButton>
					{loading && (
						<Grid container justify="center" alignItems="center">
							<CircularProgress />
						</Grid>
					)}
					<CSSTransition
						in={owns.length > 0 || participates.length > 0}
						timeout={300}
						classNames="animationScaleUp"
						unmountOnExit
					>
						<div>
							{generateTable()}
						</div>
					</CSSTransition>
					{generateDialog()}
				</Paper>
			</div>
			<RemoveDialog
				removeDialog={removeDialog}
				handleRemoveClose={handleRemoveClose}
				title="Czy chcesz usunąć ligę?"
				removeFunction={async () => deleteUserLeague(league._id)}
			/>
			<RemoveDialog
				removeDialog={removeMeDialog}
				handleRemoveClose={handleRemoveMeClose}
				title="Czy chcesz opuścić ligę?"
				removeFunction={async () => deleteMeFromLeague(meLeague._id)}
			/>
		</>
	);
};

export default UserRankingLeagues;
