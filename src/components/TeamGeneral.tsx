import React, { FunctionComponent } from 'react';
import {
	Typography,
	Grid,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody
} from '@material-ui/core';

const riders = [
	{
		firstName: 'Krzysztof',
		lastName: 'Buczkowski',
		club: 'MrGarden GKM Grudziądz',
		ksm: '10.0',
		dateOfBirth: '06.08.2020'
	},
	{
		firstName: 'Artem',
		lastName: 'Łaguta',
		club: 'MrGarden GKM Grudziądz',
		ksm: '10.0',
		dateOfBirth: '06.08.2020'
	},
	{
		firstName: 'Nicki',
		lastName: 'Pedersen',
		club: 'MrGarden GKM Grudziądz',
		ksm: '10.0',
		dateOfBirth: '06.08.2020'
	},
	{
		firstName: 'Kenneth',
		lastName: 'Bjerre',
		club: 'MrGarden GKM Grudziądz',
		ksm: '10.0',
		dateOfBirth: '06.08.2020'
	},
	{
		firstName: 'Bartosz',
		lastName: 'Zmarzlik',
		club: 'MrGarden GKM Grudziądz',
		ksm: '10.0',
		dateOfBirth: '06.08.2020'
	}
];

const TeamGeneral: FunctionComponent = () => {
	return (
		<Grid container alignItems="flex-start" className="team-container">
			<Grid item xs={12} md={4}>
				<div className="team-container__left-pane">
					<Typography className="heading-1 team-container__name">
						GKM Grudziądz
					</Typography>
					<div className="team-container__logo-box">
						<img
							src="img/kenny.jpg"
							alt="team-logo"
							className="team-container__logo"
						/>
					</div>
				</div>
			</Grid>
			<Grid item xs={12} md={8}>
				<div className="team-container__right-pane">
					<Typography className="heading-2 team-container__name">
						Kadra:
					</Typography>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Imię</TableCell>
									<TableCell>Nazwisko</TableCell>
									<TableCell>Data urodzenia</TableCell>
									<TableCell>Klub</TableCell>
									<TableCell>KSM</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{riders.map(rider => (
									<TableRow
										key={rider.firstName + rider.firstName}
										hover={true}
									>
										<TableCell>{rider.firstName}</TableCell>
										<TableCell>{rider.lastName}</TableCell>
										<TableCell>
											{rider.dateOfBirth}
										</TableCell>
										<TableCell>{rider.club}</TableCell>
										<TableCell>{rider.ksm}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			</Grid>
		</Grid>
	);
};

export default TeamGeneral;
