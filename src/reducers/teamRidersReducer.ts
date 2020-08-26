import { IRider } from '../components/Team';
import { TeamRidersAction } from '../actions/teamRidersActions';
import { SET_TEAM_RIDERS } from '../actions/actionDefinitions';

const teamRidersReducer = (
	state: IRider[],
	action: TeamRidersAction
): IRider[] => {
	switch (action.type) {
		case SET_TEAM_RIDERS:
			return action.payload;
		default:
			return state;
	}
};

export default teamRidersReducer;
