import { IRider } from '../components/TeamRiders';
import { SET_TEAM_RIDERS } from './actionDefinitions';

export interface TeamRidersAction {
	type: string;
	payload: IRider[];
}

export const setTeamRiders = (riders: IRider[]): TeamRidersAction => ({
	type: SET_TEAM_RIDERS,
	payload: riders
});
