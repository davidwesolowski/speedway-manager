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
import { FaUserPlus } from 'react-icons/fa';

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
							<FiArrowRightCircle className="users__iconButton" />
						</IconButton>
					</TableCell>
					<TableCell align="center">
						<IconButton>
							<FaUserPlus className="users__iconButton" />
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
						<TableCell align="center">Nazwa użytkownika</TableCell>
						<TableCell align="center">Nazwa drużyny</TableCell>
						<TableCell align="center">Sprawdź skład</TableCell>
						<TableCell align="center">Dodaj</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{users.length > 0 ? isFound : notFound}</TableBody>
			</Table>
		</TableContainer>
	);
};

export default UsersList;
