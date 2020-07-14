import React, { FunctionComponent } from 'react';
import { Paper, Typography, Divider } from '@material-ui/core';

const Login: FunctionComponent = () => {
	return (
		<div className="login-container">
			<div className="login-container__img"></div>
			<Paper className="login-container__box">
				<Typography
					variant="h2"
					className="heading-2 login-container__login_heading"
				>
					Zaloguj się
				</Typography>
				<Divider />
			</Paper>
		</div>
	);
};

export default Login;
