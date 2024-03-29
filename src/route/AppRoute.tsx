import React, { FunctionComponent } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
	RouteComponentProps,
	useLocation
} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WelcomePage from '../components/WelcomePage';
import Login from '../components/Login';
import Account from '../components/Account';
import Register from '../components/Register';
import { checkCookies } from '../utils/checkCookies';
import Team from '../components/Team';
import Riders from '../components/Riders';
import AddRiderToTeam from '../components/AddRiderToTeam';
import Users from '../components/Users';
import AddMatch from '../components/AddMatch';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import SelfTeaching from '../components/SelfTeaching';
import Friends from '../components/Friends';
import ListMatches from '../components/ListMatches';
import Leagues from '../components/Leagues';
import UserRankingLeagues from '../components/UserRankingLeagues';
import TeamHistory from '../components/TeamHistory';
import ClubLeagueCreate from '../components/ClubLeagueCreate';
import RankingUsers from '../components/RankingUsers';


const AppRoute: FunctionComponent = () => {
	return (
		<Router>
			<Header />
			<Route path="*" component={RoutesAnimation} />
			<Footer />
		</Router>
	);
};

const RoutesAnimation = () => {
	const location = useLocation();
	document.body.style.overflow = 'hidden';
	return (
		<TransitionGroup component={null}>
			<CSSTransition
				timeout={300}
				classNames="animationRoutes"
				key={location.key}
				unmountOnExit
			>
				<Switch location={location}>
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
					<Route
						path="/zawodnicy"
						render={(props: RouteComponentProps) => {
							const cookiesExist = checkCookies();
							if (cookiesExist) return <Riders {...props} />;
							else return <Redirect to="/login" />;
						}}
					/>
					<Route
						path="/dodaj-druzyna"
						render={(props: RouteComponentProps) => {
							const cookiesExist = checkCookies();
							if (cookiesExist)
								return <AddRiderToTeam {...props} />;
							else return <Redirect to="/login" />;
						}}
					/>
					<Route
						path="/uzytkownicy"
						render={(props: RouteComponentProps) => {
							const cookiesExist = checkCookies();
							if (cookiesExist) return <Users {...props} />;
							else return <Redirect to="/login" />;
						}}
					/>
					<Route
						path="/dodaj-mecz"
						render={(props: RouteComponentProps) => {
							const cookiesExist = checkCookies();
							if (cookiesExist) {
								return <AddMatch {...props} />;
							} else return <Redirect to="/login" />;
						}}
					/>
					<Route
						path="/znajomi"
						render={(props: RouteComponentProps) => {
							const cookiesExist = checkCookies();
							if (cookiesExist) return <Friends {...props} />;
							else return <Redirect to="/login" />;
						}}
					/>
					<Route path="/samouczek" component={SelfTeaching} />
					<Route
						path="/mecze"
						component={ListMatches}
					/>
					<Route
						path="/kluby"
						component={ClubLeagueCreate}
					/>
					<Route
						path="/ligi"
						render={(props: RouteComponentProps) => {
							const cookiesExist = checkCookies();
							if (cookiesExist) return <Leagues {...props} />;
							else return <Redirect to="/login" />;
						}}
					/>
					<Route
						path="/moje-ligi"
						render={(props: RouteComponentProps) => {
							const cookiesExist = checkCookies();
							if (cookiesExist)
								return <UserRankingLeagues {...props} />;
							else return <Redirect to="/login" />;
						}}
					/>
					<Route
						path="/historia"
						render={(props: RouteComponentProps) => {
							const cookiesExist = checkCookies();
							if (cookiesExist) return <TeamHistory {...props} />;
							else return <Redirect to="/login" />;
						}}
					/>
					<Route
						path="/ranking"
						render={(props: RouteComponentProps) => {
							const cookiesExist = checkCookies();
							if (cookiesExist)
								return <RankingUsers {...props} />;
							else return <Redirect to="/login" />;
						}}
					/>
					<Route
						path="/"
						render={(props: RouteComponentProps) => {
							if (props.location.pathname === '/')
								return <WelcomePage />;
							return <Redirect to="/" />;
						}}
					/>
				</Switch>
			</CSSTransition>
		</TransitionGroup>
	);
};

export default AppRoute;
