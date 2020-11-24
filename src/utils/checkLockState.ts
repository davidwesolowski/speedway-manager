import { Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import getToken from './getToken';
import { checkBadAuthorization } from './checkCookies';

export default function checkLockState(
	setTeamChanges: Dispatch<SetStateAction<boolean>>,
	setLoggedIn: Dispatch<SetStateAction<boolean>>,
	push: (path: string, state?: {}) => void
): boolean {
	let changes = false;
	async function getLockState() {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		const {
			data: { teamChanges }
		} = await axios.get(
			'https://fantasy-league-eti.herokuapp.com/state',
			options
		);
		changes = teamChanges;
		setTeamChanges(teamChanges);
	}

	getLockState().catch(e => {
		const {
			response: { data }
		} = e;
		if (data.statusCode == 401) {
			checkBadAuthorization(setLoggedIn, push);
		}
	});
	return changes;
}
