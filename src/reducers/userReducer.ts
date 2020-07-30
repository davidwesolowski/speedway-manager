import { UPDATE_USER, SET_USER } from '../actions/actionDefinitions';
import { IUser, UserAction } from '../actions/userActions';

const userReducer = (state: IUser, action: UserAction): IUser => {
	switch (action.type) {
		case SET_USER:
			return action.payload;
		case UPDATE_USER:
			return {
				...state,
				...action.payload
			};
		default:
			return state;
	}
};

export default userReducer;
