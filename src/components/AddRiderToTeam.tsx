import React, { FunctionComponent, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import {
	Paper,
	Typography,
	Divider,
	TextField,
	InputLabel,
	Select,
	MenuItem,
	List,
	ListItem,
	ListItemIcon,
	Checkbox,
	ListItemText,
	Grid,
	Button
} from '@material-ui/core';
import addNotification from '../utils/addNotification';
import getToken from '../utils/getToken';
import { setUser } from '../actions/userActions';
import { useStateValue } from './AppProvider';

interface IRider {
	id: string;
	firstName: string;
	lastName: string;
	nickname: string;
	dateOfBirth: string;
	isForeigner: boolean;
	ksm: number;
	club: string;
}

const AddRiderToTeam: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {
	const { setLoggedIn, dispatchUserData, userData } = useStateValue();

	const fetchUserData = async () => {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		try {
			const {
				data: { _id, username, email, avatarUrl }
			} = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/users/self',
				options
			);
			dispatchUserData(setUser({ _id, username, email, avatarUrl }));
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
	const [riders, setRiders] = useState([]);
	const [teamId, setTeamId] = useState<string>('');
	const [teamRiders, setTeamRiders] = useState([]);

	document.body.style.overflow = 'auto';

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
			getTeams(data);
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

	const getTeams = async riders => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/teams',
				options
			);
			setTeamId(data[0]._id);
			getTeamRiders(riders, data);
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

	const getTeamRiders = async (riders, team) => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/teams/${team[0]._id}/riders`,
				options
			);
			setTeamRiders([]);
			if (data !== undefined) {
				data.map(tuple => {
					setTeamRiders(teamRiders =>
						teamRiders.concat({
							id: tuple.rider._id,
							firstName: tuple.rider.firstName,
							lastName: tuple.rider.lastName,
							nickname: tuple.rider.nickname,
							dateOfBirth: tuple.rider.dateOfBirth,
							isForeigner: tuple.rider.isForeigner,
							ksm: tuple.rider.KSM,
							clubId: tuple.rider.clubId
						})
					);
				});
				setLists(riders, data);
			} else {
				setLists(riders, []);
			}
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

	const not = (a, b) => {
		return a.filter(value => b.indexOf(value) === -1);
	};

	const intersection = (a, b) => {
		return a.filter(value => b.indexOf(value) !== -1);
	};

	const [checkedPolish, setCheckedPolish] = React.useState([]);
	const [checkedForeign, setCheckedForeign] = React.useState([]);
	const [checkedU21, setCheckedU21] = React.useState([]);

	const [leftPolish, setLeftPolish] = React.useState([]);
	const [leftForeign, setLeftForeign] = React.useState([]);
	const [leftU21, setLeftU21] = React.useState([]);

	const [rightPolish, setRightPolish] = React.useState([]);
	const [rightForeign, setRightForeign] = React.useState([]);
	const [rightU21, setRightU21] = React.useState([]);

	const [clubs, setClubs] = React.useState([]);

	const isJunior = date => {
		if (new Date().getFullYear() - new Date(date).getFullYear() < 22) {
			return true;
		} else {
			return false;
		}
	};

	const setLists = (riders, teamRiders) => {
		const teamRiderIDs = teamRiders.map(val => {
			return val.riderId;
		});
		setLeftPolish(
			riders.filter(
				rider =>
					!teamRiderIDs.includes(rider._id) &&
					!rider.isForeigner &&
					!isJunior(rider.dateOfBirth)
			)
		);
		setRightPolish(
			riders.filter(
				rider =>
					teamRiderIDs.includes(rider._id) &&
					!rider.isForeigner &&
					!isJunior(rider.dateOfBirth)
			)
		);
		setLeftForeign(
			riders.filter(
				rider => !teamRiderIDs.includes(rider._id) && rider.isForeigner
			)
		);
		setRightForeign(
			riders.filter(
				rider => teamRiderIDs.includes(rider._id) && rider.isForeigner
			)
		);
		setLeftU21(
			riders.filter(
				rider =>
					!teamRiderIDs.includes(rider._id) &&
					!rider.isForeigner &&
					isJunior(rider.dateOfBirth)
			)
		);
		setRightU21(
			riders.filter(
				rider =>
					teamRiderIDs.includes(rider._id) &&
					!rider.isForeigner &&
					isJunior(rider.dateOfBirth)
			)
		);
	};

	const leftPolishChecked = intersection(checkedPolish, leftPolish);
	const rightPolishChecked = intersection(checkedPolish, rightPolish);

	const leftForeignChecked = intersection(checkedForeign, leftForeign);
	const rightForeignChecked = intersection(checkedForeign, rightForeign);

	const leftU21Checked = intersection(checkedU21, leftU21);
	const rightU21Checked = intersection(checkedU21, rightU21);

	const handleToggle = (value, type) => () => {
		if (type == 'Polish') {
			const currentIndex = checkedPolish.indexOf(value);
			const newChecked = [...checkedPolish];
			if (currentIndex === -1) {
				newChecked.push(value);
			} else {
				newChecked.splice(currentIndex, 1);
			}
			setCheckedPolish(newChecked);
		} else if (type == 'Foreign') {
			const currentIndex = checkedForeign.indexOf(value);
			const newChecked = [...checkedForeign];
			if (currentIndex === -1) {
				newChecked.push(value);
			} else {
				newChecked.splice(currentIndex, 1);
			}
			setCheckedForeign(newChecked);
		} else {
			const currentIndex = checkedU21.indexOf(value);
			const newChecked = [...checkedU21];
			if (currentIndex === -1) {
				newChecked.push(value);
			} else {
				newChecked.splice(currentIndex, 1);
			}
			setCheckedU21(newChecked);
		}
	};

	const handleAllRight = type => () => {
		if (type == 'Polish') {
			setRightPolish(rightPolish.concat(leftPolish));
			setLeftPolish([]);
		} else if (type == 'Foreign') {
			setRightForeign(rightForeign.concat(leftForeign));
			setLeftForeign([]);
		} else {
			setRightU21(rightU21.concat(leftU21));
			setLeftU21([]);
		}
	};

	const handleCheckedRight = type => () => {
		if (type == 'Polish') {
			setRightPolish(rightPolish.concat(leftPolishChecked));
			setLeftPolish(not(leftPolish, leftPolishChecked));
			setCheckedPolish(not(checkedPolish, leftPolishChecked));
		} else if (type == 'Foreign') {
			setRightForeign(rightForeign.concat(leftForeignChecked));
			setLeftForeign(not(leftForeign, leftForeignChecked));
			setCheckedForeign(not(checkedForeign, leftForeignChecked));
		} else {
			setRightU21(rightU21.concat(leftU21Checked));
			setLeftU21(not(leftU21, leftU21Checked));
			setCheckedU21(not(checkedU21, leftU21Checked));
		}
	};

	const handleCheckedLeft = type => () => {
		if (type == 'Polish') {
			setLeftPolish(leftPolish.concat(rightPolishChecked));
			setRightPolish(not(rightPolish, rightPolishChecked));
			setCheckedPolish(not(checkedPolish, rightPolishChecked));
		} else if (type == 'Foreign') {
			setLeftForeign(leftForeign.concat(rightForeignChecked));
			setRightForeign(not(rightForeign, rightForeignChecked));
			setCheckedForeign(not(checkedForeign, rightForeignChecked));
		} else {
			setLeftU21(leftU21.concat(rightU21Checked));
			setRightU21(not(rightU21, rightU21Checked));
			setCheckedU21(not(checkedU21, rightU21Checked));
		}
	};

	const handleAllLeft = type => () => {
		if (type == 'Polish') {
			setLeftPolish(leftPolish.concat(rightPolish));
			setRightPolish([]);
		} else if (type == 'Foreign') {
			setLeftForeign(leftForeign.concat(rightForeign));
			setRightForeign([]);
		} else {
			setLeftU21(leftU21.concat(rightU21));
			setRightU21([]);
		}
	};

	const listHeader = side => {
		if (side === 'Right') {
			return (
				<>
					<Typography variant="h4" className="list-header">
						Moja kadra
					</Typography>
					<Divider />
				</>
			);
		} else {
			return (
				<>
					<Typography variant="h4" className="list-header">
						Wolni zawodnicy
					</Typography>
					<Divider />
				</>
			);
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

	const findClubName = clubId => {
		const found = clubs.find(club => club.id == clubId);
		if (found) {
			return found.name;
		} else {
			return '';
		}
	};

	const customList = (items, type, side) => {
		return (
			<Paper className="list-paper">
				{listHeader(side)}
				<List dense component="div" role="list">
					{items.map(rider => {
						const labelId = `transfer-list-item-${rider.id}-label`;
						if (type === 'Polish') {
							return (
								<>
									<ListItem
										key={rider._id}
										role="listitem"
										button
										onClick={handleToggle(rider, type)}
									>
										<ListItemIcon>
											<Checkbox
												checked={
													checkedPolish.indexOf(
														rider
													) !== -1
												}
												tabIndex={-1}
												disableRipple
												inputProps={{
													'aria-labelledby': labelId
												}}
											/>
										</ListItemIcon>
										<ListItemText
											className="list-rider"
											id={labelId}
											primary={`${rider.firstName} ${rider.lastName}`}
										/>
										<ListItemText
											className="list-rider"
											id={`${labelId}-ksm`}
											primary={`${rider.KSM}`}
										/>
										<ListItemText
											className="list-rider"
											id={`${labelId}-club`}
											primary={findClubName(rider.clubId)}
										/>
									</ListItem>
									<Divider />
								</>
							);
						} else if (type === 'Foreign') {
							return (
								<>
									<ListItem
										key={rider._id}
										role="listitem"
										button
										onClick={handleToggle(rider, type)}
									>
										<ListItemIcon>
											<Checkbox
												checked={
													checkedForeign.indexOf(
														rider
													) !== -1
												}
												tabIndex={-1}
												disableRipple
												inputProps={{
													'aria-labelledby': labelId
												}}
											/>
										</ListItemIcon>
										<ListItemText
											className="list-rider"
											id={labelId}
											primary={`${rider.firstName} ${rider.lastName}`}
										/>
										<ListItemText
											className="list-rider"
											id={`${labelId}-ksm`}
											primary={`${rider.KSM}`}
										/>
										<ListItemText
											className="list-rider"
											id={`${labelId}-club`}
											primary={findClubName(rider.clubId)}
										/>
									</ListItem>
									<Divider />
								</>
							);
						} else {
							return (
								<>
									<ListItem
										key={rider._id}
										role="listitem"
										button
										onClick={handleToggle(rider, type)}
									>
										<ListItemIcon>
											<Checkbox
												checked={
													checkedU21.indexOf(
														rider
													) !== -1
												}
												tabIndex={-1}
												disableRipple
												inputProps={{
													'aria-labelledby': labelId
												}}
											/>
										</ListItemIcon>
										<ListItemText
											className="list-rider"
											id={labelId}
											primary={`${rider.firstName} ${rider.lastName}`}
										/>
										<ListItemText
											className="list-rider"
											id={`${labelId}-ksm`}
											primary={`${rider.KSM}`}
										/>
										<ListItemText
											className="list-rider"
											id={`${labelId}-club`}
											primary={findClubName(rider.clubId)}
										/>
									</ListItem>
									<Divider />
								</>
							);
						}
					})}
					<ListItem />
				</List>
			</Paper>
		);
	};

	const addNewRider = async rider => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.post(
				`https://fantasy-league-eti.herokuapp.com/teams/${teamId}/riders`,
				{ riderId: rider._id },
				options
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
					'Nie udało się wymienić zawodników z bazy',
					'danger',
					3000
				);
			}
			throw new Error('Error in getting riders');
		}
	};

	const deleteRiderFromTeam = async rider => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.delete(
				`https://fantasy-league-eti.herokuapp.com/teams/${teamId}/riders/${rider.id}`,
				options
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
					'Nie udało się wymienić zawodników z bazy',
					'danger',
					3000
				);
			}
			throw new Error('Error in getting riders');
		}
	};

	const submitRiders = async () => {
		try {
			const chosenRiders = rightU21.concat(
				rightForeign.concat(rightPolish)
			);
			const chosenRidersIDs = chosenRiders.map(val => {
				return val._id;
			});
			const teamRidersIDs = teamRiders.map(val => {
				return val.id;
			});
			const deleteRiders = teamRiders.filter(
				rider => !chosenRidersIDs.includes(rider.id)
			);
			const newRiders = chosenRiders.filter(
				rider => !teamRidersIDs.includes(rider._id)
			);

			deleteRiders.map(rider => deleteRiderFromTeam(rider));
			newRiders.map(rider => addNewRider(rider));
			addNotification(
				'Sukces',
				'Kadra została zmieniona poprawnie',
				'success',
				1000
			);
			setTimeout(() => {
				window.location.reload(false);
			}, 1000);
		} catch (e) {
			addNotification(
				'Błąd',
				'Nie udało się wymienić kadry',
				'danger',
				5000
			);
		}
	};

	useEffect(() => {
		getRiders();
		getClubs();
		if (!userData.username) fetchUserData();
	}, []);

	return (
		<>
			<div className="add-rider-to-team">
				<div className="add-rider-to-team__background" />
				<Paper className="add-rider-to-team__box">
					<Typography variant="h2" className="riders__header">
						Wybierz zawodników do drużyny
					</Typography>
					<Divider />
					<br />
					<Typography
						variant="h3"
						className="add-rider-to-team__type-header"
					>
						Polacy
					</Typography>
					<br />
					<Grid
						container
						spacing={2}
						justify="center"
						alignItems="center"
						className="list-container"
					>
						<Grid item>
							{customList(leftPolish, 'Polish', 'Left')}
						</Grid>
						<Grid item>
							<Grid
								container
								direction="column"
								alignItems="center"
							>
								<Button
									variant="outlined"
									size="small"
									className="list-button"
									onClick={handleCheckedRight('Polish')}
									disabled={
										leftPolishChecked.length === 0 ||
										leftPolishChecked.length >
											10 -
												rightForeign.length -
												rightPolish.length -
												rightU21.length
									}
								>
									&gt;
								</Button>
								<Button
									variant="outlined"
									size="small"
									className="list-button"
									onClick={handleAllLeft('Polish')}
									disabled={rightPolish.length === 0}
								>
									≪
								</Button>
								<Button
									variant="outlined"
									size="small"
									className="list-button"
									onClick={handleCheckedLeft('Polish')}
									disabled={rightPolishChecked.length === 0}
								>
									&lt;
								</Button>
							</Grid>
						</Grid>
						<Grid item>
							{customList(rightPolish, 'Polish', 'Right')}
						</Grid>
					</Grid>
					<br />
					<br />
					<Typography
						variant="h3"
						className="add-rider-to-team__type-header"
					>
						U21 (minimum 3 w kadrze)
					</Typography>
					<br />
					<Grid
						container
						spacing={2}
						justify="center"
						alignItems="center"
						className="list-container"
					>
						<Grid item>{customList(leftU21, 'U21', 'Left')}</Grid>
						<Grid item>
							<Grid
								container
								direction="column"
								alignItems="center"
							>
								<Button
									variant="outlined"
									size="small"
									className="list-button"
									onClick={handleCheckedRight('U21')}
									disabled={
										leftU21Checked.length === 0 ||
										leftU21Checked.length >
											10 -
												rightForeign.length -
												rightPolish.length -
												rightU21.length
									}
								>
									&gt;
								</Button>
								<Button
									variant="outlined"
									size="small"
									className="list-button"
									onClick={handleAllLeft('U21')}
									disabled={rightU21.length === 0}
								>
									≪
								</Button>
								<Button
									variant="outlined"
									size="small"
									className="list-button"
									onClick={handleCheckedLeft('U21')}
									disabled={rightU21Checked.length === 0}
								>
									&lt;
								</Button>
							</Grid>
						</Grid>
						<Grid item>{customList(rightU21, 'U21', 'Right')}</Grid>
					</Grid>
					<br />
					<br />
					<Typography
						variant="h3"
						className="add-rider-to-team__type-header"
					>
						Obcokrajowcy (maksymalnie 3 w kadrze)
					</Typography>
					<br />
					<Grid
						container
						spacing={2}
						justify="center"
						alignItems="center"
						className="list-container"
					>
						<Grid item>
							{customList(leftForeign, 'Foreign', 'Left')}
						</Grid>
						<Grid item>
							<Grid
								container
								direction="column"
								alignItems="center"
							>
								<Button
									variant="outlined"
									size="small"
									className="list-button"
									onClick={handleCheckedRight('Foreign')}
									disabled={
										leftForeignChecked.length === 0 ||
										leftForeignChecked.length >
											3 - rightForeign.length ||
										leftForeignChecked.length >
											10 -
												rightForeign.length -
												rightPolish.length -
												rightU21.length
									}
								>
									&gt;
								</Button>
								<Button
									variant="outlined"
									size="small"
									className="list-button"
									onClick={handleAllLeft('Foreign')}
									disabled={rightForeign.length === 0}
								>
									≪
								</Button>
								<Button
									variant="outlined"
									size="small"
									className="list-button"
									onClick={handleCheckedLeft('Foreign')}
									disabled={rightForeignChecked.length === 0}
								>
									&lt;
								</Button>
							</Grid>
						</Grid>
						<Grid item>
							{customList(rightForeign, 'Foreign', 'Right')}
						</Grid>
					</Grid>
					<br />
					<Button
						size="large"
						disabled={
							rightForeign.length +
								rightPolish.length +
								rightU21.length !==
								10 || rightU21.length < 3
						}
						onClick={submitRiders}
						className="submit-riders-button"
					>
						Zapisz zmiany
					</Button>
				</Paper>
			</div>
		</>
	);
};

export default AddRiderToTeam;
