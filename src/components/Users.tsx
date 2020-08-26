import React, {
	FunctionComponent,
	useEffect,
	useState,
	ChangeEvent
} from 'react';
import {
	Paper,
	Typography,
	TextField,
	InputAdornment,
	Grid,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	CircularProgress
} from '@material-ui/core';
import { FiSearch } from 'react-icons/fi';
import { RouteProps, useHistory } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../actions/userActions';
import { useStateValue } from './AppProvider';
import { checkBadAuthorization } from '../validation/checkCookies';
import UsersList from './UsersList';
import getToken from '../utils/getToken';
import TeamRiders, { IRider } from './TeamRiders';
import addNotification from '../utils/addNotification';

export interface IUsers {
	_id: string;
	username: string;
	avatarUrl: string;
	teamId?: string;
	teamName?: string;
	teamLogo?: string;
}

const Users: FunctionComponent<RouteProps> = () => {
	const [users, setUsers] = useState<IUsers[]>([]);
	const [userTeamRiders, setUserTeamRiders] = useState<IRider[]>([]);
	const [inputUserName, setInputUserName] = useState('');
	const [loading, setLoading] = useState(false);
	const { userData, dispatchUserData, setLoggedIn } = useStateValue();
	const { push } = useHistory();

	const filterUsers = (users: IUsers[]) => {
		if (users.length !== 0) {
			const filtered = users.filter(user =>
				user.username
					.toLowerCase()
					.includes(inputUserName.toLowerCase())
			);
			return filtered;
		}
		return [];
	};

	const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target) {
			setInputUserName(event.target.value);
		}
	};

	const handleFetchTeamRiders = async (teamId: string) => {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		try {
			const { data: riders } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/teams/${teamId}/riders`,
				options
			);
			const newRiders = riders.map(({ rider }) => {
				const riderAgeYear = new Date(rider.dateOfBirth).getFullYear();
				const currentYear = new Date().getFullYear();
				const diffYear = currentYear - riderAgeYear;
				const age =
					diffYear <= 21 ? 'U21' : diffYear <= 23 ? 'U23' : 'Senior';
				const nationality = rider.isForeigner
					? 'Zagraniczny'
					: 'Krajowy';
				return {
					firstName: rider.firstName,
					lastName: rider.lastName,
					dateOfBirth: rider.dateOfBirth,
					_id: rider._id,
					nationality,
					age,
					ksm: 0,
					club: ''
				};
			});
			setUserTeamRiders(newRiders);
		} catch (e) {
			const { response: data } = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				const title = 'Błąd';
				const message = 'Nie można pobrać drużyny';
				const type = 'danger';
				const duration = 1000;
				addNotification(title, message, type, duration);
			}
		}
	};

	useEffect(() => {
		setLoading(true);

		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};

		const fetchTeams = async () => {
			try {
				const { data } = await axios.get(
					'https://fantasy-league-eti.herokuapp.com/teams/all',
					options
				);
				return data;
			} catch (e) {
				/**/
			}
		};

		const fetchUsers = async () => {
			try {
				const { data } = await axios.get(
					'https://fantasy-league-eti.herokuapp.com/users',
					options
				);
				const teams = await fetchTeams();
				const userState = data.map(user => {
					const team = teams.find(team => team.userId === user._id);
					if (team) {
						return {
							...user,
							teamName: team.name,
							teamLogo: team.logoUrl,
							teamId: team._id
						};
					}
					return {
						...user,
						teamName: null,
						teamLogo: null,
						teamId: null
					};
				});
				setUsers(userState);
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				}
			}
		};

		const fetchUserData = async () => {
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
				/**/
			}
		};

		fetchUsers();

		if (!userData.username) fetchUserData();

		setLoading(false);
	}, []);

	return (
		<div className="users">
			<div className="users__background"></div>
			<Paper className="users__box">
				<Grid container justify="center" alignItems="center">
					<Grid item>
						<Typography variant="h3" className="users__headerText">
							Znajdź użytkownika
						</Typography>
					</Grid>
					<Grid item>
						<TextField
							placeholder="Użytkownik..."
							value={inputUserName}
							onChange={handleOnChange}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FiSearch className="users__searchIcon" />
									</InputAdornment>
								)
							}}
						/>
					</Grid>
				</Grid>
				{loading ? (
					<Grid
						container
						justify="center"
						alignItems="center"
						className="users__loading"
					>
						<CircularProgress />
					</Grid>
				) : (
					<Grid
						container
						className="users__container"
						justify="center"
						alignItems="flex-start"
					>
						<Grid
							item
							className={
								userTeamRiders.length > 0 ? 'users__list' : ''
							}
						>
							<TableContainer>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell />
											<TableCell>
												Nazwa użytkownika
											</TableCell>
											<TableCell>Nazwa drużyny</TableCell>
											<TableCell>Sprawdź skład</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{
											<UsersList
												users={filterUsers(users)}
												handleFetchTeamRiders={
													handleFetchTeamRiders
												}
											/>
										}
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
						{userTeamRiders.length > 0 ? (
							<Grid item>
								<TeamRiders riders={userTeamRiders} />
							</Grid>
						) : null}
					</Grid>
				)}
			</Paper>
		</div>
	);
};

export default Users;
