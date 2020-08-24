import React, { FunctionComponent, useEffect, useState } from 'react';
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
	CircularProgress,
	Avatar,
	IconButton
} from '@material-ui/core';
import { FiSearch, FiArrowRightCircle } from 'react-icons/fi';
import { RouteProps, useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { setUser } from '../actions/userActions';
import { useStateValue } from './AppProvider';
import { checkBadAuthorization } from '../validation/checkCookies';

const Users: FunctionComponent<RouteProps> = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const { userData, dispatchUserData, setLoggedIn } = useStateValue();
	const { push } = useHistory();

	useEffect(() => {
		const cookies = new Cookies();
		const access_token = cookies.get('access_token');
		const options = {
			headers: {
				Authorization: `Bearer ${access_token}`
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
							teamLogo: team.logo_url,
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
				dispatchUserData(
					setUser({ username, email, avatar_url: avatarUrl })
				);
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
					<Grid container className="users__container">
						<Grid item>
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
										{users.length !== 0
											? users.map(user => (
													<TableRow
														key={user._id}
														hover={true}
													>
														<TableCell align="center">
															<Avatar
																alt="user-avatar"
																src={
																	user.avatarUrl
																}
															/>
														</TableCell>
														<TableCell align="center">
															{user.username}
														</TableCell>
														<TableCell align="center">
															{user.teamName ||
																'BRAK'}
														</TableCell>
														<TableCell align="center">
															<IconButton
																disabled={
																	!user.teamId
																}
															>
																<FiArrowRightCircle className="users__teamButton" />
															</IconButton>
														</TableCell>
													</TableRow>
											  ))
											: null}
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
					</Grid>
				)}
			</Paper>
		</div>
	);
};

export default Users;
