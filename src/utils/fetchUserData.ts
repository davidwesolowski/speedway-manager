import { Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { setUser, UserAction } from '../actions/userActions';
import getToken from './getToken';
import { checkBadAuthorization } from './checkCookies';

const fetchUserData = async (
	dispatch: Dispatch<UserAction>,
	setLoggedIn: Dispatch<SetStateAction<boolean>>,
	push: (path: string, state?: {}) => void
): Promise<string> => {
	const accessToken = getToken();
	const options = {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	};
	try {
		const {
			data: { _id, username, email, avatarUrl, role }
		} = await axios.get(
			'https://fantasy-league-eti.herokuapp.com/users/self',
			options
		);
		dispatch(setUser({ _id, username, email, avatarUrl, role }));
		setLoggedIn(true);
		return _id;
	} catch (e) {
		const {
			response: { data }
		} = e;
		if (data.statusCode == 401) {
			checkBadAuthorization(setLoggedIn, push);
		}
	}
};

export default fetchUserData;
