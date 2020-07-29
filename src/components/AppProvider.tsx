import React, {
	createContext,
	useReducer,
	FunctionComponent,
	ReactNode
} from 'react';
import userReducer from '../reducers/userReducer';

export const AppContext = createContext({});
interface IChildren {
	children: ReactNode;
}

const defaultUserData = {
	email: '',
	username: '',
	avatar_url: ''
};

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
