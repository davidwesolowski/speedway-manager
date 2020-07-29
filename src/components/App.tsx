import React, { FunctionComponent } from 'react';
import ReactNotification from 'react-notifications-component';
import AppRoute from '../route/AppRoute';
import AppProvider from './AppProvider';

const App: FunctionComponent = () => {
	return (
		<>
			<ReactNotification />
			<AppProvider>
				<AppRoute />
			</AppProvider>
		</>
	);
};

export default App;
