import React, { FunctionComponent } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WelcomePage from '../components/WelcomePage';
import Login from '../components/Login';
import Register from '../components/Register';

const AppRoute: FunctionComponent = () => {
	return (
		<Router>
			<Header />
			<Switch>
				<Route path="/" exact component={WelcomePage} />
				<Route path="/login" component={Login} />
				<Route path="/rejestracja" component={Register} />
			</Switch>
			<Footer />
		</Router>
	);
};

export default AppRoute;
