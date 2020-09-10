import React, { FunctionComponent } from 'react';
import { RouteProps } from 'react-router-dom';
import { Paper, Typography, Divider } from '@material-ui/core';

const Friends: FunctionComponent<RouteProps> = () => {
	return (
		<div className="friends">
			<div className="friends__background"></div>
			<Paper className="friends__box">
				<Typography variant="h2" className="friends__headerText">
					Lista znajomych
				</Typography>
				<Divider />
			</Paper>
		</div>
	);
};

export default Friends;
