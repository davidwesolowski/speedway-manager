import React, {
	FunctionComponent,
	useContext,
	useState,
	MouseEvent,
	useEffect
} from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
	AppBar,
	Toolbar,
	IconButton,
	Avatar,
	Menu,
	MenuItem,
	Hidden,
	Divider,
	List,
	ListItem,
	Drawer
} from '@material-ui/core';
import { FaUserCircle } from 'react-icons/fa';
import { AppContext } from './AppProvider';
import Cookies from 'universal-cookie';
import { FiChevronLeft, FiMenu } from 'react-icons/fi';
import checkAdminRole from '../utils/checkAdminRole';
import { setTeamRiders } from '../actions/teamRidersActions';
import { setUser } from '../actions/userActions';
import getToken from '../utils/getToken';
import addNotification from '../utils/addNotification';
import { checkBadAuthorization, checkCookies } from '../utils/checkCookies';
import checkLockState from '../utils/checkLockState';

const unauthorizedMenuItems = [
	{
		link: '/',
		name: 'Start'
	},
	{
		link: '/mecze',
		name: 'Wyniki'
	},
	{
		link: '/samouczek',
		name: 'Samouczek'
	},
	{
		link: '/kluby',
		name: 'Kluby'
	}
];

const authorizedMenuItems = [
	{
		link: '/',
		name: 'Start'
	},
	{
		link: '/mecze',
		name: 'Wyniki'
	},
	{
		link: '/druzyna',
		name: 'Drużyna'
	},
	{
		link: '/ranking',
		name: 'Ranking'
	},
	{
		link: '/uzytkownicy',
		name: 'Użytkownicy'
	},
	{
		link: '/zawodnicy',
		name: 'Zawodnicy'
	},
	{
		link: '/kluby',
		name: 'Kluby'
	},
	{
		link: '/samouczek',
		name: 'Samouczek'
	}
];

const adminMenuItems = [
	...authorizedMenuItems,
	{
		link: '/konto',
		name: 'Konto'
	},
	{
		link: '/dodaj-druzyna',
		name: 'Dodaj zawodników do drużyny'
	},
	{
		link: '/dodaj-mecz',
		name: 'Dodaj mecz'
	},
	{
		link: '/znajomi',
		name: 'Znajomi'
	},
	{
		link: '/ligi',
		name: 'Ligi'
	},
	{
		link: '/moje-ligi',
		name: 'Moje ligi'
	},
	{
		link: '/historia',
		name: 'Historia'
	}
];

const Header: FunctionComponent = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [mobileOpen, setMobileOpen] = useState(false);
	const { push } = useHistory();
	const {
		userData,
		dispatchTeamRiders,
		dispatchUserData,
		loggedIn,
		setLoggedIn,
		teamChanges,
		setTeamChanges
	} = useContext(AppContext);
	const isMenuOpen = Boolean(anchorEl);
	const location = useLocation();
	const isAdmin = checkAdminRole(userData.role) && checkCookies();

	const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => setAnchorEl(null);
	const handleLogout = () => {
		const cookies = new Cookies();
		cookies.remove('accessToken');
		setLoggedIn(false);
		dispatchUserData(
			setUser({
				_id: '',
				email: '',
				username: '',
				avatarUrl: '',
				role: ''
			})
		);
		dispatchTeamRiders(setTeamRiders([]));
		push('/login');
	};

	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

	useEffect(() => {
		if (checkCookies()) {
			checkLockState(setTeamChanges, setLoggedIn, push);
		}
	}, [location, userData.role]);

	const unauthorized = (
		<Hidden xsDown>
			<ul className="header__nav">
				{unauthorizedMenuItems.map(({ link, name }) => (
					<li className="header__item" key={link}>
						<Link to={link} className="header__link">
							{name}
						</Link>
					</li>
				))}
			</ul>
		</Hidden>
	);

	const authorized = (
		<Hidden smDown>
			<ul className="header__nav">
				{authorizedMenuItems.map(({ link, name }) => (
					<li className="header__item" key={link}>
						<Link to={link} className="header__link">
							{name}
						</Link>
					</li>
				))}
			</ul>
		</Hidden>
	);

	const adminHeader = (
		<ul className="header__nav">
			<li className="header__item" onClick={handleDrawerToggle}>
				<span className="header__link header__link-admin">
					Panel administratora
				</span>
			</li>
		</ul>
	);

	const menuItemsList = (menuItems: { name: string; link: string }[]) =>
		menuItems.map(({ link, name }, index) => {
			if (link === '') {
				const relock = async () => {
					const accessToken = getToken();
					const options = {
						headers: {
							Authorization: `Bearer ${accessToken}`
						}
					};
					const {
						data: { teamChanges: changes }
					} = await axios.post(
						'https://fantasy-league-eti.herokuapp.com/state',
						{ teamChanges: !teamChanges },
						options
					);
					setTeamChanges(changes);
				};
				const handleClick = () =>
					relock()
						.then(() => setMobileOpen(false))
						.catch(e => {
							const {
								response: { data }
							} = e;
							if (data.statusCode == 401) {
								checkBadAuthorization(setLoggedIn, push);
							}
						});

				return (
					<ListItem
						key={link}
						divider={index + 1 == menuItems.length ? false : true}
						button
						onClick={handleClick}
					>
						<span className="header__mobileLink">{name}</span>
					</ListItem>
				);
			}
			return (
				<ListItem
					key={link}
					divider={index + 1 == menuItems.length ? false : true}
					button
					onClick={() => setMobileOpen(false)}
				>
					<Link to={link} className="header__mobileLink">
						{name}
					</Link>
				</ListItem>
			);
		});

	const lock = { name: 'Blokuj zmianę drużyny', link: '' };
	const unlock = { name: 'Odblokuj zmianę drużyny', link: '' };
	const drawer = (
		<div>
			<div className="header__drawerClose">
				<IconButton onClick={handleDrawerToggle}>
					<FiChevronLeft className="header__drawerCloseIcon" />
				</IconButton>
			</div>
			<Divider />
			<List>
				{isAdmin
					? menuItemsList(
							teamChanges
								? [lock, ...adminMenuItems]
								: [unlock, ...adminMenuItems]
					  )
					: loggedIn
					? menuItemsList(authorizedMenuItems)
					: menuItemsList(unauthorizedMenuItems)}
			</List>
		</div>
	);
	return (
		<>
			<AppBar position="sticky" className="header">
				<Toolbar className="header__toolbar">
					{!isAdmin && (
						<Hidden mdUp={loggedIn} smUp={!loggedIn}>
							<IconButton
								onClick={handleDrawerToggle}
								className="header__mobileIconButton"
							>
								<FiMenu className="header__mobileIcon" />
							</IconButton>
						</Hidden>
					)}
					<Hidden mdDown={loggedIn} smDown={!loggedIn}>
						<div className="header__logo">
							<Link to="/" className="header__logo-link">
								<img
									src="img/logo41.png"
									alt="logo-small-header"
									className="header__logo-img"
								/>
							</Link>
						</div>
					</Hidden>
					<Hidden lgUp={loggedIn} smDown={loggedIn} xsUp={!loggedIn}>
						<div className="header__logo-bike">
							<Link to="/" className="header__logo-link">
								<img
									src="img/motologo.png"
									alt="logo-big-header"
									className="header__logo-bike-img"
								/>
							</Link>
						</div>
					</Hidden>
					{isAdmin ? adminHeader : loggedIn && authorized}
					{loggedIn ? (
						<IconButton onClick={handleProfileMenuOpen}>
							<Avatar
								alt="user-avatar"
								className="header__avatar"
								src={userData.avatarUrl}
							/>
							<span className="header__username">
								{userData.username}
							</span>
						</IconButton>
					) : (
						<>
							{unauthorized}
							<Link
								to="/login"
								className="header__link header__login"
							>
								<div>Zaloguj</div>
								<FaUserCircle />
							</Link>
						</>
					)}
				</Toolbar>
			</AppBar>
			{isAdmin ? (
				<Drawer
					anchor="left"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					className="adminDrawer"
				>
					{drawer}
				</Drawer>
			) : (
				<Hidden mdUp={loggedIn} smUp={!loggedIn}>
					<Drawer
						anchor="left"
						open={mobileOpen}
						onClose={handleDrawerToggle}
						ModalProps={{ keepMounted: true }}
					>
						{drawer}
					</Drawer>
				</Hidden>
			)}
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClick={handleMenuClose}
			>
				<MenuItem className="header__menuItem">
					<Link to="/konto" className="header__menuLink">
						Profil
					</Link>
				</MenuItem>
				<MenuItem className="header__menuItem">
					<Link to="/znajomi" className="header__menuLink">
						Znajomi
					</Link>
				</MenuItem>
				<MenuItem className="header__menuItem">
					<Link to="moje-ligi" className="header__menuLink">
						Moje ligi
					</Link>
				</MenuItem>
				<MenuItem className="header__menuItem">
					<Link to="/samouczek" className="header__menuLink">
						Samouczek
					</Link>
				</MenuItem>
				<MenuItem className="header__menuItem" onClick={handleLogout}>
					<span className="header__menuLink">Wyloguj</span>
				</MenuItem>
			</Menu>
		</>
	);
};

export default Header;
