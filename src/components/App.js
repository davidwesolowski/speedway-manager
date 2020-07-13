import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import WelcomePage from './WelcomePage';
import Footer from './Footer';

const App = () => {
	return (
		<Router>
			<Header />
			<Switch>
				<Route path="/" exact component={WelcomePage} />
			</Switch>
			<Footer />
		</Router>
	);
};

export default App;
