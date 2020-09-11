import React, { FunctionComponent, useEffect, useState } from 'react';
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
import axios from 'axios';
import { IUsers } from './Users';
import {
	FaUserPlus,
	FaUserFriends,
	FaUserClock,
	FaUserCheck
} from 'react-icons/fa';
import getToken from '../utils/getToken';
import { useStateValue } from './AppProvider';
import { useHistory } from 'react-router-dom';
import { checkBadAuthorization } from '../utils/checkCookies';
import addNotification from '../utils/addNotification';

interface IProps {
	users: IUsers[];
	handleFetchTeamRiders?: (teamId: string) => Promise<void>;
	handleAcceptInvitation?: (userId: string) => Promise<void>;
}

const UsersList: FunctionComponent<IProps> = ({
	users,
	handleFetchTeamRiders,
	handleAcceptInvitation
}) => {
	const [pendingSentInvitations, setPendingSentInvitations] = useState([]);
	const [myFriends, setMyFriends] = useState([]);
	const { userData, setLoggedIn } = useStateValue();
	const { push } = useHistory();

	const sendInvitation = async (friendId: string) => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			await axios.post(
				'https://fantasy-league-eti.herokuapp.com/friendlist',
				{
					senderId: userData._id,
					invitedId: friendId
				},
				options
			);
			const { data: user } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/users/${friendId}`,
				options
			);
			await fetchMyFriendsAndInvitations();

			const title = 'Sukces!';
			const message = `Wysłano zaproszenie do ${user.username.toUpperCase()}`;
			const type = 'success';
			const duration = 2000;
			addNotification(title, message, type, duration);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				const title = 'Błąd!';
				const message =
					'Wystąpił błąd podczas dodawania użytkownika do znajomych';
				const type = 'danger';
				const duration = 2000;
				addNotification(title, message, type, duration);
			}
		}
	};

	const fetchMyFriendsAndInvitations = async () => {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		try {
			const { data: sentInvitations } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/friendlist/myInvitations/${userData._id}`,
				options
			);
			const { data: friends } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/friendlist/myFriends/${userData._id}`,
				options
			);
			setPendingSentInvitations(sentInvitations);
			setMyFriends(friends);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			}
		}
	};

	useEffect(() => {
		if (handleFetchTeamRiders) {
			fetchMyFriendsAndInvitations();
		}
	}, []);

	const usersIcons = user =>
		myFriends.find(
			friend =>
				friend.invitedId == user._id || friend.senderId == user._id
		) ? (
			<FaUserFriends className="users__friend" />
		) : pendingSentInvitations.find(
				invitation => invitation.invitedId == user._id
		  ) ? (
			<FaUserClock className="users__iconButton" />
		) : (
			<IconButton onClick={() => sendInvitation(user._id)}>
				<FaUserPlus className="users__iconButton" />
			</IconButton>
		);

	const friendsIcons = user =>
		user.invited ? (
			<IconButton onClick={() => handleAcceptInvitation(user._id)}>
				<FaUserCheck className="users__accept" />
			</IconButton>
		) : (
			<FaUserFriends className="users__friend" />
		);

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
						{handleFetchTeamRiders
							? usersIcons(user)
							: friendsIcons(user)}
					</TableCell>
				</TableRow>
			))}
		</>
	);
	const notFound = (
		<TableRow>
			<TableCell colSpan={5} align="center">
				{handleFetchTeamRiders
					? 'Nie znalezniono użytkownika.'
					: 'Aktualnie nie masz znajomych.'}
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
						<TableCell align="center">
							{handleFetchTeamRiders ? 'Dodaj' : 'Status'}
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{users.length > 0 ? isFound : notFound}</TableBody>
			</Table>
		</TableContainer>
	);
};

export default UsersList;
