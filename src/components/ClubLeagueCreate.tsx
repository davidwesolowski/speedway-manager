import React, { FunctionComponent } from 'react';
import { RouteProps } from 'react-router-dom';
import { Grid, Paper } from '@material-ui/core';

const ClubLeagueCreate: FunctionComponent<RouteProps> = () => {
	return (
		<div className="clubLeague__container">
			<div className="clubLeague__img"></div>
			<Paper className="clubLeague__box">
				<Grid container>
					<Grid item xs={12} sm={6}></Grid>
				</Grid>
			</Paper>
		</div>
	);
};

export default ClubLeagueCreate;
