import {
	Avatar,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { CSSTransition } from 'react-transition-group';

interface IRankingUser {
	_id: string;
	avatarUrl: string | null;
	name: string;
	teamLogo: string | null;
	teamName: string;
	points: number;
}

interface IProps {
	users: IRankingUser[];
}

const compare = (userA: IRankingUser, userB: IRankingUser): number => {
	if (userA.points <= userB.points) return 1;
	else return -1;
};

const getPositions = (users: IRankingUser[]) => {
	const positions = [];
	let position = 1;
	for (let i = 0; i < users.length; i++) {
		if (i === 0) {
			positions.push(position);
		} else if (users[i].points === users[i - 1].points) positions.push('');
		else positions.push(++position);
	}
	return positions;
};

const RankingUsersList: FunctionComponent<IProps> = ({ users }) => {
	const sortedUsers = users.sort(compare);
	const positions = getPositions(sortedUsers);

	return (
		<CSSTransition
			in={users.length > 0}
			timeout={300}
			classNames="animationScaleUp"
			unmountOnExit
		>
			<Grid container justify="center">
				<Grid item xs={8}>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell align="center">Lp.</TableCell>
									<TableCell />
									<TableCell align="center">
										Nazwa użytkownika
									</TableCell>
									<TableCell />
									<TableCell align="center">
										Drużyna
									</TableCell>
									<TableCell align="center">Punkty</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{sortedUsers.map((user, index) => (
									<TableRow key={user._id} hover={true}>
										<TableCell align="center">
											{positions[index]}
										</TableCell>
										<TableCell align="center">
											<Avatar
												src={user.avatarUrl}
												alt="user-avatar"
											/>
										</TableCell>
										<TableCell align="center">
											{user.name}
										</TableCell>
										<TableCell align="center">
											<Avatar
												src={user.teamLogo}
												alt="team-logo"
											/>
										</TableCell>
										<TableCell align="center">
											<div className="rankingUsers__infoCell">
												{user.teamName}
											</div>
										</TableCell>
										<TableCell align="center">
											{user.points}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>
		</CSSTransition>
	);
};

export default RankingUsersList;
