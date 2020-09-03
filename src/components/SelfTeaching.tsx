import React, { useEffect } from 'react';
import axios from 'axios';
import { useStateValue } from './AppProvider';
import { checkCookies, checkBadAuthorization } from '../utils/checkCookies';
import getToken from '../utils/getToken';
import { setUser } from '../actions/userActions';
import { useHistory } from 'react-router-dom';

const SelfTeaching = () => {
	const { userData, dispatchUserData, setLoggedIn } = useStateValue();
	const { push } = useHistory();

	useEffect(() => {
		const checkIfUserLoggedIn = async () => {
			const cookiesExist = checkCookies();
			if (cookiesExist && !userData.username) {
				const accessToken = getToken();
				const options = {
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
				try {
					const {
						data: { username, email, avatarUrl }
					} = await axios.get(
						'https://fantasy-league-eti.herokuapp.com/users/self',
						options
					);
					dispatchUserData(setUser({ username, email, avatarUrl }));
					setLoggedIn(true);
				} catch (e) {
					const {
						response: { data }
					} = e;
					if (data.statusCode == 401) {
						checkBadAuthorization(setLoggedIn, push);
					}
				}
			}
		};
		checkIfUserLoggedIn();
	}, []);

	return (
		<div className="selfTeaching__container">
			<div className="selfTeaching__img"></div>
		</div>
	);
};

export default SelfTeaching;
