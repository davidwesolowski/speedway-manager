import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Paper, Typography, Divider } from '@material-ui/core';

const Team: FunctionComponent<RouteComponentProps> = () => {
	return (
		<div className="team-container">
			<div className="team-container__img"></div>
			<Paper className="team-container__box">
				<Typography
					variant="h2"
					className="heading-1 team-container__heading"
				>
					Swórz swoją drużynę marzeń!
				</Typography>
				<Divider />
			</Paper>
		</div>
	);
};

export default Team;
