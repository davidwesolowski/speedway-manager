import { Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import getToken from './getToken';

export default function checkLockState(
	setTeamChanges: Dispatch<SetStateAction<boolean>>
) {
	async function getLockState(): Promise<boolean> {
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
		const changes = teamChanges;
		setTeamChanges(teamChanges);
		return changes;
	}
	return getLockState;
}
