import React, {
	createContext,
	useReducer,
	FunctionComponent,
	ReactNode,
	Dispatch,
	useState,
	SetStateAction,
	useContext
} from 'react';
import userReducer from '../reducers/userReducer';
import { IUser, UserAction } from '../actions/userActions';
import teamRidersReducer from '../reducers/teamRidersReducer';
import { IRider } from './TeamRiders';
import { TeamRidersAction } from '../actions/teamRidersActions';
interface IChildren {
	children: ReactNode;
}

interface IAppContext {
	userData: IUser;
	dispatchUserData: Dispatch<UserAction>;
	loggedIn: boolean;
	setLoggedIn: Dispatch<SetStateAction<boolean>>;
	teamRiders: IRider[];
	dispatchTeamRiders: Dispatch<TeamRidersAction>;
	teamChanges: boolean;
	setTeamChanges: Dispatch<SetStateAction<boolean>>;
}

const defaultUserData: IUser = {
	_id: '',
	email: '',
	username: '',
	avatarUrl: '',
	role: ''
};

const defaultUserContext: IAppContext = {
	userData: defaultUserData,
	dispatchUserData: () => null,
	loggedIn: false,
	setLoggedIn: () => false,
	teamRiders: [],
	dispatchTeamRiders: () => null,
	teamChanges: true,
	setTeamChanges: () => null
};

export const AppContext = createContext<IAppContext>(defaultUserContext);

export const useStateValue = () => useContext(AppContext);

const AppProvider: FunctionComponent<IChildren> = ({ children }) => {
	const [userData, dispatchUserData] = useReducer(
		userReducer,
		defaultUserData
	);
	const [teamRiders, dispatchTeamRiders] = useReducer(teamRidersReducer, []);
	const [loggedIn, setLoggedIn] = useState(false);
	const [teamChanges, setTeamChanges] = useState(true);

	return (
		<AppContext.Provider
			value={{
				userData,
				dispatchUserData,
				loggedIn,
				setLoggedIn,
				teamRiders,
				dispatchTeamRiders,
				teamChanges,
				setTeamChanges
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
