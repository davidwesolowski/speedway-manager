import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteProps, useHistory } from 'react-router-dom';
import axios from 'axios';
import {
	Paper,
	Typography,
	Divider,
	Grid,
	CircularProgress
} from '@material-ui/core';
import getToken from '../utils/getToken';
import { useStateValue } from './AppProvider';
import { checkBadAuthorization } from '../utils/checkCookies';
import { IUsers } from './Users';
import UsersList from './UsersList';
import { CSSTransition } from 'react-transition-group';
import fetchUserData from '../utils/fetchUserData';

const Friends: FunctionComponent<RouteProps> = () => {
	const [friends, setFriends] = useState<IUsers[]>([]);
	const [loading, setLoading] = useState(true);
	const { setLoggedIn, dispatchUserData, userData } = useStateValue();
	const { push } = useHistory();

	const handleRemoveFriendOrInvitation = async (userId: string) => {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		const { data } = await axios.get(
			`https://fantasy-league-eti.herokuapp.com/friendlist/myFriends/${userData._id}`,
			options
		);
		const isMyFriend = data.find(
			friend => friend.senderId === userId || friend.invitedId === userId
		);
		let invitationId;
		if (isMyFriend) {
			invitationId = isMyFriend._id;
		} else {
			const { data: invitations } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/friendlist/myInvitations/${userId}`,
				options
			);
			invitationId = invitations.find(
				invitation => invitation.invitedId === userData._id
			)._id;
		}
		await axios.delete(
			`https://fantasy-league-eti.herokuapp.com/friendlist/${invitationId}`,
			options
		);
		setFriends(friends.filter(friend => friend._id !== userId));
	};

	const handleAcceptInvitation = async (userId: string) => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/friendlist/myInvitations/${userId}`,
				options
			);
			const invitation = data.find(
				invitation => invitation.invitedId === userData._id
			);
			if (invitation) {
				await axios.patch(
					`https://fantasy-league-eti.herokuapp.com/friendlist/${invitation._id}`,
					{},
					options
				);
				setFriends(
					friends.map(friend => {
						if (friend._id === userId) {
							return {
								...friend,
								invited: false
							};
						}
						return friend;
					})
				);
			}
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
		setLoading(true);
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};

		const fetchCurrentAndPendingFriends = async () => {
			try {
				const userId = await fetchUserData(
					dispatchUserData,
					setLoggedIn,
					push
				);
				if (userId) {
					const { data: currentFriends } = await axios.get(
						`https://fantasy-league-eti.herokuapp.com/friendlist/myFriends/${userId}`,
						options
					);
					const { data: pendingFriends } = await axios.get(
						`https://fantasy-league-eti.herokuapp.com/friendlist/pendingInvitations/${userId}`,
						options
					);
					const { data: teams } = await axios.get(
						'https://fantasy-league-eti.herokuapp.com/teams/all',
						options
					);
					const allFriends = [...currentFriends, ...pendingFriends];
					const friendsWithPersonalDetails = await Promise.all(
						allFriends.map(async friend => {
							let _id;
							let invited = false;
							if (!friend.accepted) {
								invited = true;
							}
							if (friend.invitedId != userId) {
								_id = friend.invitedId;
							} else if (friend.senderId != userId) {
								_id = friend.senderId;
							}
							const { data: user } = await axios.get(
								`https://fantasy-league-eti.herokuapp.com/users/${_id}`,
								options
							);
							return {
								...user,
								invited
							};
						})
					);
					const friendsWithTeamDetails = friendsWithPersonalDetails.map(
						friend => {
							const team = teams.find(
								team => team.userId == friend._id
							);
							if (team) {
								return {
									...friend,
									teamName: team.name,
									teamLogo: team.logoUrl,
									teamId: team._id
								};
							}
							return {
								...friend,
								teamName: null,
								teamLogo: null,
								teamId: null
							};
						}
					);
					setFriends(friendsWithTeamDetails);
				}
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				}
			}
		};

		fetchCurrentAndPendingFriends().then(() => setLoading(false));

		setTimeout(() => {
			document.body.style.overflow = 'auto';
		}, 3000);
	}, []);
	return (
		<div className="friends users">
			<div className="friends__background"></div>
			<Paper className="friends__box">
				<Typography variant="h2" className="friends__headerText">
					Lista znajomych
				</Typography>
				<Divider />
				{loading && (
					<Grid
						container
						justify="center"
						alignItems="center"
						className="users__loading"
					>
						<CircularProgress />
					</Grid>
				)}
				<CSSTransition
					in={loading === false}
					timeout={300}
					classNames="animationScaleUp"
					unmountOnExit
				>
					<UsersList
						users={friends}
						handleAcceptInvitation={handleAcceptInvitation}
						handleRemoveFriendOrInvitation={
							handleRemoveFriendOrInvitation
						}
						columns={6}
					/>
				</CSSTransition>
			</Paper>
		</div>
	);
};

export default Friends;
