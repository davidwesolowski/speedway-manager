import {
	Avatar,
	CircularProgress,
	Divider,
	Grid,
	MenuItem,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import addNotification from '../utils/addNotification';
import { checkBadAuthorization } from '../utils/checkCookies';
import fetchUserData from '../utils/fetchUserData';
import getToken from '../utils/getToken';
import { useStateValue } from './AppProvider';

const TeamHistory: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {
	const { setLoggedIn, dispatchUserData, userData } = useStateValue();

	const [rounds, setRounds] = useState([]);
	const [selectedRound, setSelectedRound] = useState<string>('all');
	const [historyRiders, setHistoryRiders] = useState([]);
	const [team, setTeam] = useState([]);
	const [historyResults, setHistoryResults] = useState([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [fullScore, setFullScore] = useState(0);

	const getRounds = async () => {
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
		setRounds(data);
	};

	const getHistoryResults = async teamId => {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		const { data } = await axios.get(
			`https://fantasy-league-eti.herokuapp.com/teams/${teamId}/results`,
			options
		);

		setHistoryResults(data);
		getHistoryRiders(data, selectedRound);
	};

	const getHistoryRiders = (results, round) => {
		if (results.find(result => result.round._id === round)) {
			setHistoryRiders(
				results.find(result => result.round._id === round).riders
			);
		} else if (round === 'all') {
			const resultsAll = results.reduce((prev, curr) => {
				const ridersScore = curr.riders.reduce(
					(prev, curr) => ({
						...prev,
						[curr.riderId]: {
							id: curr.riderId,
							score: curr.score,
							firstName: curr.firstName,
							lastName: curr.lastName,
							image: curr.image
						}
					}),
					{}
				);
				const keys = Object.keys(ridersScore);
				keys.forEach(key => {
					if (prev[key]) {
						prev[key] = {
							...prev[key],
							score: prev[key].score + ridersScore[key].score
						};
					} else {
						prev[key] = new Object();
						prev[key] = {
							id: ridersScore[key].id,
							firstName: ridersScore[key].firstName,
							lastName: ridersScore[key].lastName,
							score: ridersScore[key].score,
							image: ridersScore[key].image
						};
					}
				});
				if (prev.score) {
					prev.score += curr.score;
				} else {
					prev.score = 0;
					prev.score += curr.score;
				}
				return prev;
			}, {});
			const historyRiders = Object.keys(resultsAll)
				.filter(key => key !== 'score')
				.map(key => ({
					riderId: resultsAll[key].id,
					firstName: resultsAll[key].firstName,
					lastName: resultsAll[key].lastName,
					score: resultsAll[key].score,
					image: resultsAll[key].image
				}));
			setHistoryRiders(historyRiders);
			setFullScore(resultsAll.score ? resultsAll.score : 0);
		} else {
			setHistoryRiders([]);
		}
	};

	const getTeam = async () => {
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

		setTeam(data);
		getHistoryResults(data[0]._id);
	};

	const generateRounds = () => {
		return rounds.map((round, index) => {
			return (
				<MenuItem key={index} value={round._id}>
					Kolejka {round.number}
				</MenuItem>
			);
		});
	};

	const handleOnChangeSelect = () => event => {
		event.persist();
		if (event.target) {
			setSelectedRound(event.target.value);
			getHistoryRiders(historyResults, event.target.value);
		}
	};

	const generateTable = () => {
		return (
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell></TableCell>
							<TableCell>Imię</TableCell>
							<TableCell>Nazwisko</TableCell>
							{selectedRound !== 'all' && (
								<TableCell>KSM</TableCell>
							)}
							<TableCell>Wynik</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{historyRiders.map(rider => (
							<TableRow key={rider.riderId} hover={true}>
								<TableCell>
									<Avatar
										src={rider.image}
										alt="rider-avatar"
									/>
								</TableCell>
								<TableCell>{rider.firstName}</TableCell>
								<TableCell>{rider.lastName}</TableCell>
								{selectedRound !== 'all' && (
									<TableCell>
										{Math.round(rider.KSM * 100) / 100}
									</TableCell>
								)}
								<TableCell>{rider.score}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	};

	const postToUpdateAssigns = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.post(
				'https://fantasy-league-eti.herokuapp.com/rounds/resolve-current',
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
					'Nie udało się stworzyć przypisań z bazy',
					'danger',
					3000
				);
			}
			throw new Error('Error in getting rounds');
		}
	};

	const getTotalScore = () => {
		if (historyResults.find(result => result.round._id === selectedRound)) {
			return (
				<Typography variant="h1" className="history__fullScoreText">
					{`Łączny wynik: ${
						historyResults.find(
							result => result.round._id === selectedRound
						).score
					}`}
				</Typography>
			);
		} else if (selectedRound === 'all' && fullScore !== 0) {
			return (
				<Typography variant="h1" className="history__fullScoreText">
					{`Łączny wynik: ${fullScore}`}
				</Typography>
			);
		} else {
			return (
				<Typography variant="h1" className="history__fullScoreText">
					Brak danych
				</Typography>
			);
		}
	};

	useEffect(() => {
		setLoading(true);
		(async function () {
			try {
				await getRounds();
				await getTeam();
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
		//postToUpdateAssigns();
		setTimeout(() => {
			document.body.style.overflow = 'auto';
		}, 2000);
	}, []);

	return (
		<>
			<div className="history">
				<div className="history__background"></div>
				<Paper className="history__box">
					<Typography
						variant="h2"
						className="heading-1 history__heading"
					>
						Historia składu
					</Typography>
					<Divider />
					<br />
					<Select
						value={selectedRound || ''}
						onChange={handleOnChangeSelect()}
					>
						<MenuItem key="all" value="all">
							Wszystkie kolejki
						</MenuItem>
						{generateRounds()}
					</Select>
					{loading && (
						<Grid container justify="center" alignItems="center">
							<CircularProgress />
						</Grid>
					)}
					<CSSTransition
						in={historyRiders.length > 0}
						timeout={300}
						classNames="animationScaleUp"
						unmountOnExit
					>
						<div>
							<br />
							<div className="history__riders-list">
									{generateTable()}
							</div>
						</div>
					</CSSTransition>
					<CSSTransition
						in={historyRiders.length >= 0}
						timeout={300}
						classNames="animationScaleUp"
						unmountOnExit
					>
						<div>
							<br />
							<div className="history__full-score">
								{getTotalScore()}
							</div>
						</div>
					</CSSTransition>
				</Paper>
			</div>
		</>
	);
};

export default TeamHistory;
