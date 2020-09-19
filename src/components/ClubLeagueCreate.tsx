import React, {
	ChangeEvent,
	FormEvent,
	FunctionComponent,
	useEffect,
	useState
} from 'react';
import { RouteProps, useHistory } from 'react-router-dom';
import {
	Button,
	FormControl,
	Grid,
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

interface ILeagueState {
	name: string;
	country: string;
}

const defaultLeague: ILeagueState = {
	name: '',
	country: ''
};

const ClubLeagueCreate: FunctionComponent<RouteProps> = () => {
	const [league, setLeague] = useState(defaultLeague);
	const { dispatchUserData, setLoggedIn, userData } = useStateValue();
	const { push } = useHistory();

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
			}
		}
	};

	const clubsRender = clubs => {
		<Table>
			<TableHead>
				<TableRow>
					<TableCell />
					<TableCell align="center">Nazwa</TableCell>
					<TableCell align="center">Liga</TableCell>
				</TableRow>
			</TableHead>
			<TableBody></TableBody>
		</Table>;
	};

	useEffect(() => {
		if (!userData.username)
			fetchUserData(dispatchUserData, setLoggedIn, push);
	}, []);

	return (
		<div className="clubLeague">
			<div className="clubLeague__img"></div>
			<Paper className="clubLeague__box">
				<Grid container>
					<Grid item xs={12} sm={6}></Grid>
					<Grid item xs={12} sm={6}>
						<Grid container>
							<Grid item xs={12}>
								<TeamCreate url="https://fantasy-league-eti.herokuapp.com/clubs" />
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
													value={league.country}
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
				</Grid>
			</Paper>
		</div>
	);
};

export default ClubLeagueCreate;
