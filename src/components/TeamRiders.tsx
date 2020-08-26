import React, { FunctionComponent } from 'react';
import {
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody
} from '@material-ui/core';
import { useStateValue } from './AppProvider';

export interface IRider {
	_id: string;
	firstName: string;
	lastName: string;
	club: string;
	nationality: string;
	ksm: number;
	dateOfBirth: string;
	age: string;
}

const displayDate = (date: string): string => {
	const newDate = new Date(date);
	const year = newDate.getFullYear();
	const month =
		newDate.getMonth() < 9
			? `0${newDate.getMonth() + 1}`
			: newDate.getMonth() + 1;
	const day = newDate.getDate();
	return `${day}.${month}.${year}`;
};

const TeamRiders: FunctionComponent = () => {
	const { teamRiders } = useStateValue();

	return (
		<div className="teamRiders">
			<Typography className="heading-2 teamRiders__name">
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
						{teamRiders.map(rider => (
							<TableRow key={rider._id} hover={true}>
								<TableCell>{rider.firstName}</TableCell>
								<TableCell>{rider.lastName}</TableCell>
								<TableCell>
									{displayDate(rider.dateOfBirth)}
								</TableCell>
								<TableCell>{rider.club}</TableCell>
								<TableCell>{rider.ksm}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default TeamRiders;
