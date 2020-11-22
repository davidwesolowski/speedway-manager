import React, { FunctionComponent } from 'react';
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Avatar
} from '@material-ui/core';

export interface IRider {
	_id: string;
	firstName: string;
	lastName: string;
	club?: string;
	nationality?: string;
	ksm: number;
	dateOfBirth: string;
	age?: string;
	image: string | null;
	isActive?: boolean;
}

interface IProps {
	riders: IRider[];
	clubRirders?: boolean;
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

const TeamRiders: FunctionComponent<IProps> = ({ riders, clubRirders }) => {
	return (
		<div className="teamRiders">
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell></TableCell>
							<TableCell align="center">Imię</TableCell>
							<TableCell align="center">Nazwisko</TableCell>
							<TableCell align="center">Data urodzenia</TableCell>
							{!clubRirders ? (
								<TableCell align="center">Klub</TableCell>
							) : null}
							<TableCell align="center">KSM</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{riders.map(rider => (
							<TableRow key={rider._id} hover={true}>
								<TableCell>
									<Avatar
										src={rider.image}
										alt="rider-avatar"
									/>
								</TableCell>
								<TableCell align="center">
									{rider.firstName}
								</TableCell>
								<TableCell align="center">
									{rider.lastName}
								</TableCell>
								<TableCell align="center">
									{displayDate(rider.dateOfBirth)}
								</TableCell>
								{!clubRirders ? (
									<TableCell align="center">
										{rider.club}
									</TableCell>
								) : null}
								<TableCell align="center">
									{rider.ksm}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default TeamRiders;
