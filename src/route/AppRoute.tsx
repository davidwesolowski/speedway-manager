import React, { FunctionComponent } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
	RouteComponentProps
} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WelcomePage from '../components/WelcomePage';
import Login from '../components/Login';
import Account from '../components/Account';
import Register from '../components/Register';
import checkCookies from '../validation/checkCookies';
import Team from '../components/Team';

const AppRoute: FunctionComponent = () => {
	return (
		<Router>
			<Header />
			<Switch>
				<Route path="/" exact component={WelcomePage} />
				<Route
					path="/login"
					render={(props: RouteComponentProps) => {
						const cookiesExist = checkCookies();
						if (cookiesExist) return <Redirect to="/druzyna" />;
						else return <Login {...props} />;
					}}
				/>
				<Route
					path="/konto"
					render={(props: RouteComponentProps) => {
						const cookiesExist = checkCookies();
						if (cookiesExist) return <Account {...props} />;
						else return <Redirect to="/login" />;
					}}
				/>
				<Route
					path="/rejestracja"
					render={(props: RouteComponentProps) => {
						const cookiesExist = checkCookies();
						if (cookiesExist) return <Redirect to="/druzyna" />;
						else return <Register {...props} />;
					}}
				/>
				<Route
					path="/druzyna"
					render={(props: RouteComponentProps) => {
						const cookiesExist = checkCookies();
						if (cookiesExist) return <Team {...props} />;
						else return <Redirect to="/login" />;
					}}
				/>
			</Switch>
			<Footer />
		</Router>
	);
};

export default AppRoute;
