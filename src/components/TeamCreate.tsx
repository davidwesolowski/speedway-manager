import React, { FunctionComponent } from 'react';
import {
	Typography,
	FormControl,
	Grid,
	TextField,
	Select,
	MenuItem,
	InputLabel
} from '@material-ui/core';

const TeamCreate: FunctionComponent = () => {
	return (
		<div className="team-create-contaier">
			<Typography className="heading-3 team-create-container__heading">
				Stwórz drużynę
			</Typography>
			<form
				className="team-create-container__form"
				encType="multipart/form-data"
			>
				<Grid container justify="center">
					<Grid
						item
						xs={5}
						className="team-create-container__form-fields"
					>
						<FormControl className="team-create-container__form-field">
							<TextField label="Nazwa" required />
						</FormControl>
						<FormControl
							required
							className="team-create-container__form-field"
						>
							<InputLabel id="id-league">Liga</InputLabel>
							<Select labelId="id-league">
								<MenuItem className="team-create-container__form-menu">
									PGE Ekstraliga
								</MenuItem>
								<MenuItem className="team-create-container__form-menu">
									eWINNER 1. Liga
								</MenuItem>
								<MenuItem className="team-create-container__form-menu">
									2. Liga żużlowa
								</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

export default TeamCreate;
