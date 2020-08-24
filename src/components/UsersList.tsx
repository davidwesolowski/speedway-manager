import React, { FunctionComponent } from 'react';
import { TableRow, TableCell, Avatar, IconButton } from '@material-ui/core';
import { FiArrowRightCircle } from 'react-icons/fi';
import { IUsers } from './Users';

type Props = {
	users: IUsers[];
};

const UsersList: FunctionComponent<Props> = ({ users }) => {
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
						<IconButton disabled={!user.teamId}>
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

	return users.length > 0 ? isFound : notFound;
};

export default UsersList;
