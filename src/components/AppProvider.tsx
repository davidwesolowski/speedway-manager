import React, {
	createContext,
	useReducer,
	FunctionComponent,
	ReactNode,
	Dispatch
} from 'react';
import userReducer from '../reducers/userReducer';
import { IUser, UserAction } from '../actions/userActions';
interface IChildren {
	children: ReactNode;
}

interface IAppContext {
	userData: IUser;
	dispatchUserData: Dispatch<UserAction>;
}

const defaultUserData: IUser = {
	email: '',
	username: '',
	avatar_url: ''
};

const defaultUserContext: IAppContext = {
	userData: defaultUserData,
	dispatchUserData: () => null
};

export const AppContext = createContext<IAppContext>(defaultUserContext);

const AppProvider: FunctionComponent<IChildren> = ({ children }) => {
	const [userData, dispatchUserData] = useReducer(
		userReducer,
		defaultUserData
	);

	return (
		<AppContext.Provider value={{ userData, dispatchUserData }}>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
