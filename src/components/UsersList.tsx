import React, { FunctionComponent, useEffect, useState } from 'react';
import {
	TableRow,
	TableCell,
	Avatar,
	IconButton,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	Dialog,
	DialogTitle,
	Typography,
	DialogContent,
	Grid,
	FormControl,
	Select,
	MenuItem,
	Button
} from '@material-ui/core';
import { FiArrowRightCircle, FiPlus, FiX } from 'react-icons/fi';
import axios from 'axios';
import { IUsers } from './Users';
import {
	FaUserPlus,
	FaUserFriends,
	FaUserClock,
	FaUserCheck,
	FaUserTimes
} from 'react-icons/fa';
import getToken from '../utils/getToken';
import { useStateValue } from './AppProvider';
import { useHistory } from 'react-router-dom';
import { checkBadAuthorization } from '../utils/checkCookies';
import addNotification from '../utils/addNotification';

interface IProps {
	users: IUsers[];
	handleFetchTeamRiders?: (teamId: string, username: string) => Promise<void>;
	handleAcceptInvitation?: (userId: string) => Promise<void>;
	handleRemoveFriendOrInvitation?: (userId: string) => Promise<void>;
	columns: number;
}

const UsersList: FunctionComponent<IProps> = ({
	users,
	handleFetchTeamRiders,
	handleAcceptInvitation,
	handleRemoveFriendOrInvitation,
	columns
}) => {
	const [pendingSentInvitations, setPendingSentInvitations] = useState([]);
	const [
		pendingReceivedInvitations,
		setPendingReceivedInvitations
	] = useState([]);
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
			const { data: receivedInvitations } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/friendlist/pendingInvitations/${userData._id}`,
				options
			);
			setPendingSentInvitations(sentInvitations);
			setMyFriends(friends);
			setPendingReceivedInvitations(receivedInvitations);
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
		getUsersLeagues();
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
		) : pendingReceivedInvitations.find(
				invitation => invitation.senderId == user._id
		  ) ? (
			<IconButton
				onClick={async () => {
					await handleAcceptInvitation(user._id);
					await fetchMyFriendsAndInvitations();
				}}
			>
				<FaUserCheck className="users__accept" />
			</IconButton>
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
					{handleFetchTeamRiders ? (
						<TableCell align="center">
							<IconButton
								disabled={!user.teamId}
								onClick={() =>
									handleFetchTeamRiders(
										user.teamId,
										user.username
									)
								}
							>
								<FiArrowRightCircle
									className={
										user.teamId
											? 'users__iconButton users__iconButton-active'
											: 'users__iconButton'
									}
								/>
							</IconButton>
						</TableCell>
					) : null}
					<TableCell align="center">
						{handleFetchTeamRiders
							? usersIcons(user)
							: friendsIcons(user)}
					</TableCell>
					{!handleFetchTeamRiders ? (
						<TableCell align="center">
							<IconButton
								onClick={() => openAddToLeagueDialog(user._id)}
							>
								<FiPlus className="users__addToLeague" />
							</IconButton>
						</TableCell>
					) : null}
					{!handleFetchTeamRiders ? (
						<TableCell align="center">
							<IconButton
								onClick={() =>
									handleRemoveFriendOrInvitation(user._id)
								}
							>
								<FaUserTimes className="users__remove" />
							</IconButton>
						</TableCell>
					) : null}
				</TableRow>
			))}
		</>
	);
	const notFound = (
		<TableRow>
			<TableCell colSpan={columns} align="center">
				{handleFetchTeamRiders
					? 'Nie znalezniono użytkownika.'
					: 'Aktualnie nie masz znajomych.'}
			</TableCell>
		</TableRow>
	);

	const [openAddLeagueDialog, setOpenAddLeagueDialog] = useState<boolean>(
		false
	);
	const [friendToLeague, setFriendToLeague] = useState<string>('');
	const [leagueToAddFriend, setLeagueToAddFriend] = useState<string>('');
	const [userLeagues, setUserLeagues] = useState([]);

	const handleOnChangeSelectLeague = () => event => {
		event.persist();
		if (event.target) {
			setLeagueToAddFriend(event.target.value);
		}
	};

	const openAddToLeagueDialog = userId => {
		setFriendToLeague(userId);
		setOpenAddLeagueDialog(true);
	};

	const closeAddToLeagueDialog = () => {
		setFriendToLeague('');
		setOpenAddLeagueDialog(false);
	};

	const handleOnSubmit = async () => {
		if (leagueToAddFriend !== '') {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			try {
				await axios.post(
					`https://fantasy-league-eti.herokuapp.com/rankings/${leagueToAddFriend}`,
					{ userId: friendToLeague },
					options
				);
				addNotification(
					'Sukces!',
					'Udało się dodać znajomego do ligi!',
					'success',
					1000
				);
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				} else if (data.statusCode == 503) {
					addNotification(
						'Błąd',
						'Znajomy już jest przypisany do tego rankingu',
						'danger',
						1000
					);
				}
			}
		}
	};

	const generateUsersLeagues = () => {
		if (userLeagues) {
			return userLeagues.map((ranking, index) => {
				return (
					<MenuItem key={ranking._id} value={ranking._id}>
						{ranking.name}
					</MenuItem>
				);
			});
		}
	};

	const getUsersLeagues = async () => {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		try {
			const { data } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/rankings`,
				options
			);
			setUserLeagues(data.owns);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			}
		}
	};

	return (
		<>
			<Dialog
				className="users-dialog"
				onClose={closeAddToLeagueDialog}
				open={openAddLeagueDialog}
			>
				<DialogTitle>
					<div className="users-dialog__header">
						<Typography
							variant="h4"
							className="users-dialog__title"
						>
							Dodawanie znajomego do ligi
						</Typography>
						<IconButton
							onClick={closeAddToLeagueDialog}
							className="users-dialog__fix"
						>
							<FiX />
						</IconButton>
					</div>
				</DialogTitle>
				<DialogContent dividers>
					<form
						className="users-dialog__form"
						onSubmit={handleOnSubmit}
					>
						<Grid container>
							<Grid
								item
								xs={7}
								className="users-dialog__form_fields"
							>
								<FormControl className="users-dialog__form_field">
									<Select
										onChange={handleOnChangeSelectLeague()}
										value={leagueToAddFriend || ''}
										className="users-dialog__select"
									>
										{generateUsersLeagues()}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<Button
									type="submit"
									className="btn dialog__form_button"
								>
									Dodaj
								</Button>
							</Grid>
						</Grid>
					</form>
				</DialogContent>
			</Dialog>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">
								Nazwa użytkownika
							</TableCell>
							<TableCell align="center">Nazwa drużyny</TableCell>
							{handleFetchTeamRiders ? (
								<TableCell align="center">
									Sprawdź skład
								</TableCell>
							) : null}
							<TableCell align="center">
								{handleFetchTeamRiders ? 'Dodaj' : 'Status'}
							</TableCell>
							{!handleFetchTeamRiders ? (
								<TableCell align="center">
									Dodaj do ligi
								</TableCell>
							) : null}
							{!handleFetchTeamRiders ? (
								<TableCell align="center">Usuń</TableCell>
							) : null}
						</TableRow>
					</TableHead>
					<TableBody>
						{users.length > 0 ? isFound : notFound}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default UsersList;
