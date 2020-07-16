import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Paper, Typography, Divider } from '@material-ui/core';

const Register: FunctionComponent<RouteComponentProps> = props => {
	return (
		<div className="register-container">
			<div className="register-container__img"></div>
			<Paper className="register-container__box">
				<Typography
					variant="h2"
					className="heading-1 register-container__heading"
				>
					Rejestracja
				</Typography>
				<Divider />
			</Paper>
		</div>
	);
};

export default Register;
