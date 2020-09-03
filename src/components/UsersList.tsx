import React, { FunctionComponent } from 'react';
import {
	TableRow,
	TableCell,
	Avatar,
	IconButton,
	TableContainer,
	Table,
	TableHead,
	TableBody
} from '@material-ui/core';
import { FiArrowRightCircle } from 'react-icons/fi';
import { IUsers } from './Users';

interface IProps {
	users: IUsers[];
	handleFetchTeamRiders: (teamId: string) => Promise<void>;
}

const UsersList: FunctionComponent<IProps> = ({
	users,
	handleFetchTeamRiders
}) => {
	const isFound = (
		<>
			{users.map(user => (
				<TableRow key={user._id} hover={true}>
					<TableCell align="center">
						<Avatar alt="user-avatar" src={user.avatarUrl} />
					</TableCell>
					<TableCell align="center">{user.username}</TableCell>
					<TableCell align="center">
						{user.teamName || 'BRAK'}
					</TableCell>
					<TableCell align="center">
						<IconButton
							disabled={!user.teamId}
							onClick={() => handleFetchTeamRiders(user.teamId)}
						>
							<FiArrowRightCircle className="users__teamButton" />
						</IconButton>
					</TableCell>
				</TableRow>
			))}
		</>
	);
	const notFound = (
		<TableRow>
			<TableCell colSpan={4} align="center">
				Nie znalezniono użytkownika.
			</TableCell>
		</TableRow>
	);

	return (
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
				<TableBody>{users.length > 0 ? isFound : notFound}</TableBody>
			</Table>
		</TableContainer>
	);
};

export default UsersList;
