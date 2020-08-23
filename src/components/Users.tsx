import React, { FunctionComponent } from 'react';
import {
	Paper,
	Typography,
	TextField,
	InputAdornment,
	Grid,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody
} from '@material-ui/core';
import { FiSearch } from 'react-icons/fi';
import { RouteProps } from 'react-router-dom';

const Users: FunctionComponent<RouteProps> = () => {
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
				<Grid container className="users__container">
					<Grid item>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell />
										<TableCell>Nazwa użytkownika</TableCell>
										<TableCell>Nazwa drużyny</TableCell>
										<TableCell>Sprawdź skład</TableCell>
									</TableRow>
								</TableHead>
								<TableBody></TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
			</Paper>
		</div>
	);
};

export default Users;
