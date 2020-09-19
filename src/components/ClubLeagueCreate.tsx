import React, { FunctionComponent, useEffect } from 'react';
import { RouteProps, useHistory } from 'react-router-dom';
import {
	Button,
	FormControl,
	Grid,
	Paper,
	TextField,
	Typography
} from '@material-ui/core';
import TeamCreate from './TeamCreate';
import { useStateValue } from './AppProvider';
import fetchUserData from '../utils/fetchUserData';

const ClubLeagueCreate: FunctionComponent<RouteProps> = () => {
	const { dispatchUserData, setLoggedIn, userData } = useStateValue();
	const { push } = useHistory();

	useEffect(() => {
		if (!userData.username)
			fetchUserData(dispatchUserData, setLoggedIn, push);
	}, []);

	return (
		<div className="clubLeague__container">
			<div className="clubLeague__img"></div>
			<Paper className="clubLeague__box">
				<Grid container>
					<Grid item xs={12} sm={3}></Grid>
					<Grid item xs={12} sm={5}>
						<TeamCreate url="https://fantasy-league-eti.herokuapp.com/clubs" />
					</Grid>
					<Grid item xs={12} sm={4}>
						<Typography className="heading-3 clubLeague__heading">
							Utwórz ligę
						</Typography>
						<form className="clubLeague__form">
							<Grid container>
								<Grid item xs={12}>
									<FormControl className="clubLeague__form-field">
										<TextField label="Liga" required />
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<FormControl className="clubLeague__form-field">
										<TextField label="Kraj" required />
									</FormControl>
								</Grid>
								<Grid item xs={12}>
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
			</Paper>
		</div>
	);
};

export default ClubLeagueCreate;
