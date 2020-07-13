import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WelcomePage from '../components/WelcomePage';

const AppRoute = () => {
	return (
		<Router>
			<Header />
			<Switch>
				<Route to="/" exact component={WelcomePage} />
			</Switch>
			<Footer />
		</Router>
	);
};

export default AppRoute;
