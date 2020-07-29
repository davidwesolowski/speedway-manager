import React, { FunctionComponent } from 'react';
import ReactNotification from 'react-notifications-component';
import AppRoute from '../route/AppRoute';

const App: FunctionComponent = () => {
	return (
		<>
			<ReactNotification />
			<AppRoute />
		</>
	);
};

export default App;
