import React, { FunctionComponent } from 'react';
import {
	Paper,
	Typography,
	TextField,
	InputAdornment,
	Grid
} from '@material-ui/core';
import { FiSearch } from 'react-icons/fi';

const Users: FunctionComponent = () => {
	return (
		<div className="users">
			<div className="users__background"></div>
			<Paper className="users__box">
				<Grid container justify="center" alignItems="center">
					<Grid item>
						<Typography variant="h3" className="users__headerText">
							Znajdź użytkownika
						</Typography>
					</Grid>
					<Grid item>
						<TextField
							placeholder="Użytkownik..."
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FiSearch className="users__searchIcon" />
									</InputAdornment>
								)
							}}
						/>
					</Grid>
				</Grid>
			</Paper>
		</div>
	);
};

export default Users;
