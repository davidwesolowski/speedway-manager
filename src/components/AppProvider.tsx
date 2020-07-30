import React, {
	createContext,
	useReducer,
	FunctionComponent,
	ReactNode,
	Dispatch,
	useState,
	SetStateAction
} from 'react';
import userReducer from '../reducers/userReducer';
import { IUser, UserAction } from '../actions/userActions';
interface IChildren {
	children: ReactNode;
}

interface IAppContext {
	userData: IUser;
	dispatchUserData: Dispatch<UserAction>;
	loggedIn: boolean;
	setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const defaultUserData: IUser = {
	email: '',
	username: '',
	avatar_url: ''
};

const defaultUserContext: IAppContext = {
	userData: defaultUserData,
	dispatchUserData: () => null,
	loggedIn: false,
	setLoggedIn: () => false
};

export const AppContext = createContext<IAppContext>(defaultUserContext);

const AppProvider: FunctionComponent<IChildren> = ({ children }) => {
	const [userData, dispatchUserData] = useReducer(
		userReducer,
		defaultUserData
	);
	const [loggedIn, setLoggedIn] = useState<boolean>(false);

	return (
		<AppContext.Provider
			value={{ userData, dispatchUserData, loggedIn, setLoggedIn }}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
