import React, { FunctionComponent, useState, useEffect, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import {
	Paper,
	Typography,
	Divider,
	List,
	ListItem,
	Checkbox,
	Grid,
	Button,
	Avatar,
	CircularProgress
} from '@material-ui/core';
import addNotification from '../utils/addNotification';
import getToken from '../utils/getToken';
import { useStateValue } from './AppProvider';
import fetchUserData from '../utils/fetchUserData';
import { checkBadAuthorization } from '../utils/checkCookies';
import { CSSTransition } from 'react-transition-group';

interface IRider {
	_id: string;
	firstName: string;
	lastName: string;
	nickname: string;
	dateOfBirth: string;
	isForeigner: boolean;
	age: string;
	nationality: string;
	image: string;
	ksm: number;
	club: string;
}

const AddRiderToTeam: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {
	const { setLoggedIn, dispatchUserData, userData } = useStateValue();
	const [riders, setRiders] = useState([]);
	const [teamId, setTeamId] = useState<string>('');
	const [teamRiders, setTeamRiders] = useState([]);
	const [loading, setLoading] = useState<boolean>(true);

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
			const newRiders = data.map(rider => {
				const riderAgeYear = new Date(rider.dateOfBirth).getFullYear();
				const currentYear = new Date().getFullYear();
				const diffYear = currentYear - riderAgeYear;
				const age =
					diffYear <= 21 ? 'U21' : diffYear <= 23 ? 'U23' : 'Senior';
				const nationality = rider.isForeigner
					? 'Zagraniczny'
					: 'Krajowy';
				return {
					_id: rider._id,
					firstName: rider.firstName,
					lastName: rider.lastName,
					nickname: rider.nickname,
					dateOfBirth: rider.dateOfBirth,
					isForeigner: rider.isForeigner,
					ksm: Math.round(rider.KSM * 100) / 100,
					image: rider.image,
					clubId: rider.clubId,
					age,
					nationality
				};
			});
			setRiders(newRiders);
			getTeams(newRiders);
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
			const tr = data.map(tuple => {
				const riderAgeYear = new Date(
					tuple.rider.dateOfBirth
				).getFullYear();
				const currentYear = new Date().getFullYear();
				const diffYear = currentYear - riderAgeYear;
				const age =
					diffYear <= 21
						? 'U21'
						: diffYear <= 23
						? 'U23'
						: 'Senior';
				const nationality = tuple.rider.isForeigner
					? 'Zagraniczny'
					: 'Krajowy';
				return ({
					_id: tuple.rider._id,
					firstName: tuple.rider.firstName,
					lastName: tuple.rider.lastName,
					nickname: tuple.rider.nickname,
					dateOfBirth: tuple.rider.dateOfBirth,
					isForeigner: tuple.rider.isForeigner,
					ksm: tuple.assignedKSM,
					image: tuple.rider.image,
					clubId: tuple.rider.clubId,
					age,
					nationality
				});
			});
			console.log(tr);
			if (data !== undefined) {
				data.map(tuple => {
					setTeamRiders(teamRiders => {
						const riderAgeYear = new Date(
							tuple.rider.dateOfBirth
						).getFullYear();
						const currentYear = new Date().getFullYear();
						const diffYear = currentYear - riderAgeYear;
						const age =
							diffYear <= 21
								? 'U21'
								: diffYear <= 23
								? 'U23'
								: 'Senior';
						const nationality = tuple.rider.isForeigner
							? 'Zagraniczny'
							: 'Krajowy';
						return teamRiders.concat({
							_id: tuple.rider._id,
							firstName: tuple.rider.firstName,
							lastName: tuple.rider.lastName,
							nickname: tuple.rider.nickname,
							dateOfBirth: tuple.rider.dateOfBirth,
							isForeigner: tuple.rider.isForeigner,
							ksm: tuple.assignedKSM,
							image: tuple.rider.image,
							clubId: tuple.rider.clubId,
							age,
							nationality
						});
					});
				});
				setLists(riders, tr);
			} else {
				setLists(riders, []);
			}
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

	const isJunior = date => {
		if (new Date().getFullYear() - new Date(date).getFullYear() < 22) {
			return true;
		} else {
			return false;
		}
	};

	const setLists = (riders, teamRiders) => {
		const teamRiderIDs = teamRiders.map(val => {
			return val._id;
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
			teamRiders.filter(
				rider =>
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
			teamRiders.filter(
				rider => rider.isForeigner
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
			teamRiders.filter(
				rider =>
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

	const customRider = (rider: IRider, checked, type) => {
		return (
			<Fragment key={rider._id}>
				<ListItem
					role="listitem"
					button
					onClick={handleToggle(rider, type)}
				>
					<Grid
						container
						justify="space-evenly"
						alignItems="center"
						className="team-match-container__rider"
					>
						<Grid item xs={1}>
							<Checkbox
								checked={checked.indexOf(rider) !== -1}
								tabIndex={-1}
								disableRipple
							/>
						</Grid>
						<Grid item xs={1}>
							<Avatar src={rider.image} alt="rider-avatar" />
						</Grid>
						<Grid item xs={2}>
							{`${rider.firstName} ${rider.lastName}`}
						</Grid>
						<Grid item xs={2}>
							{rider.nationality}
						</Grid>
						<Grid item xs={1}>
							{rider.age}
						</Grid>
						<Grid item xs={1}>
							{rider.ksm}
						</Grid>
					</Grid>
				</ListItem>
				<Divider />
			</Fragment>
		);
	};

	const customList = (items, type, side) => {
		return (
			<Paper className="list-paper">
				{listHeader(side)}
				<List dense component="div" role="list">
					{items.map(rider => {
						if (type === 'Polish') {
							return customRider(rider, checkedPolish, type);
						} else if (type === 'Foreign') {
							return customRider(rider, checkedForeign, type);
						} else {
							return customRider(rider, checkedU21, type);
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
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się wymienić zawodników z bazy',
					'danger',
					3000
				);
			}
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
				`https://fantasy-league-eti.herokuapp.com/teams/${teamId}/riders/${rider._id}`,
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
					'Nie udało się wymienić zawodników z bazy',
					'danger',
					3000
				);
			}
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
				return val._id;
			});
			const deleteRiders = teamRiders.filter(
				rider => !chosenRidersIDs.includes(rider._id)
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
		} catch (e) {
			addNotification(
				'Błąd',
				'Nie udało się wymienić kadry',
				'danger',
				5000
			);
		}
	};

	const countChosenRiders = () => {
		return (rightForeign.length + rightPolish.length + rightU21.length);
	}

	useEffect(() => {
		setLoading(true);
		(async function () {
			try {
				await getRiders();
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
			setTimeout(() => {
				setLoading(false);
			}, 400);
		})();
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
					{loading && (
						<Grid container justify="center" alignItems="center">
							<CircularProgress />
						</Grid>
					)}
					<CSSTransition
						in={
							leftForeign.length > 0 ||
							leftPolish.length > 0 ||
							leftU21.length > 0 ||
							rightForeign.length > 0 ||
							rightPolish.length > 0 ||
							rightU21.length > 0
						}
						timeout={600}
						classNames="animationScaleUp"
						unmountOnExit
					>
						<>
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
								<Grid
									item
									xs={12}
									lg={5}
									style={{ alignSelf: 'flex-start' }}
								>
									{customList(leftPolish, 'Polish', 'Left')}
								</Grid>
								<Grid item xs={2}>
									<Grid
										container
										direction="column"
										alignItems="center"
									>
										<Button
											variant="outlined"
											size="small"
											className="list-button"
											onClick={handleCheckedRight(
												'Polish'
											)}
											disabled={
												leftPolishChecked.length ===
													0 ||
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
											onClick={handleCheckedLeft(
												'Polish'
											)}
											disabled={
												rightPolishChecked.length === 0
											}
										>
											&lt;
										</Button>
									</Grid>
								</Grid>
								<Grid
									item
									xs={12}
									lg={5}
									style={{ alignSelf: 'flex-start' }}
								>
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
								<Grid
									item
									xs={12}
									lg={5}
									style={{ alignSelf: 'flex-start' }}
								>
									{customList(leftU21, 'U21', 'Left')}
								</Grid>
								<Grid item xs={2}>
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
											disabled={
												rightU21Checked.length === 0
											}
										>
											&lt;
										</Button>
									</Grid>
								</Grid>
								<Grid
									item
									xs={12}
									lg={5}
									style={{ alignSelf: 'flex-start' }}
								>
									{customList(rightU21, 'U21', 'Right')}
								</Grid>
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
								<Grid
									item
									xs={12}
									lg={5}
									style={{ alignSelf: 'flex-start' }}
								>
									{customList(leftForeign, 'Foreign', 'Left')}
								</Grid>
								<Grid item xs={2}>
									<Grid
										container
										direction="column"
										alignItems="center"
									>
										<Button
											variant="outlined"
											size="small"
											className="list-button"
											onClick={handleCheckedRight(
												'Foreign'
											)}
											disabled={
												leftForeignChecked.length ===
													0 ||
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
											onClick={handleCheckedLeft(
												'Foreign'
											)}
											disabled={
												rightForeignChecked.length === 0
											}
										>
											&lt;
										</Button>
									</Grid>
								</Grid>
								<Grid
									item
									xs={12}
									lg={5}
									style={{ alignSelf: 'flex-start' }}
								>
									{customList(
										rightForeign,
										'Foreign',
										'Right'
									)}
								</Grid>
							</Grid>
							<br />
							<div className="add-rider-to-team__summary">
								Wybrano {countChosenRiders()}/10 zawodników
							</div>
							<br/>
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
						</>
					</CSSTransition>
				</Paper>
			</div>
		</>
	);
};

export default AddRiderToTeam;
